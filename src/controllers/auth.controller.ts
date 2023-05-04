import { server } from '../dependencies/index.dependencies';
import { NextFunction, Request, Response } from 'express';
import { attachCookieToResponse, createTokenUser } from '../utils/index.util';
import { AuthService } from '../services/index.service';
import { TokenI } from '../utils/create-token.util';
import { BaseController } from './base.controller';

const statusCodes = server.statusCode;
const crypto = server.crypto;

export class AuthController extends BaseController {
	constructor(protected readonly service: AuthService) {
		super();
		this.setContext(this);
	}

	public async registerMetPostWiChainOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { email, name: username, password } = req.body;
		const userService: any = this.service.useService('User');

		const { serviceError: checkEmailError, serviceMsg: checkEmailMsg } =
			await this.service.checkRegisterEmail(email);

		if (checkEmailError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: checkEmailMsg
			});
		}

		const isFirstAccount: boolean =
			(await userService.model.countDocuments({})) === 0;
		const role: string = isFirstAccount ? 'admin' : 'user';

		const verificationToken = crypto.randomBytes(40).toString('hex');

		const { serviceError, serviceMsg } = await this.service.createUser({
			username,
			email,
			password,
			role,
			verificationToken
		});

		if (serviceError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.CREATED).json({
			msg: 'User successfully created',
			username,
			role
		});
	}

	public async loginMetPostWiChainOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: 'Enter all the data correctly'
			});
		}
		const tokenService = this.service.useService('Token');
		const userService = this.service.useService('User');

		const {
			serviceError,
			serviceMsg,
			serviceItem: user
		} = await this.service.findUserByEmail(email);

		if (serviceError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: serviceMsg
			});
		}

		if (!user) {
			return res.status(statusCodes.UNAUTHORIZED).json({
				msg: 'Invalid Credentials'
			});
		}

		const isPasswordCorrect: boolean =
			await userService.model.prototype.comparePassword(
				password,
				user.password
			);

		if (!isPasswordCorrect) {
			return res.status(statusCodes.UNAUTHORIZED).json({
				msg: 'Wrong password'
			});
		}

		const tokenUser: TokenI = createTokenUser(user);

		let refreshToken: any = '';

		const {
			serviceError: findTokenError,
			serviceMsg: findTokenMsg,
			serviceItem: existingToken
		} = await tokenService.findToken(user._id);

		if (existingToken) {
			const { isValid } = existingToken;

			if (!isValid) {
				return res.status(statusCodes.UNAUTHORIZED).json({
					msg: 'Invalid Credentials'
				});
			}

			refreshToken = existingToken.refreshToken;

			attachCookieToResponse({
				res,
				user: tokenUser,
				refreshToken
			});

			return res.status(statusCodes.OK).json({
				user: tokenUser
			});
		}

		refreshToken = crypto.randomBytes(40).toString('hex');
		const userAgent = req.headers['user-agent'];
		const ip = req.ip;

		const userToken = {
			refreshToken,
			userAgent,
			ip,
			user: user._id
		};

		const {
			serviceError: createTokenError,
			serviceMsg: createTokenMsg,
			serviceItem: token
		} = await tokenService.createToken(userToken);

		if (createTokenError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: createTokenMsg
			});
		}

		attachCookieToResponse({
			res,
			user: tokenUser,
			refreshToken
		});

		console.log(req);

		return res.status(statusCodes.OK).json({
			user: tokenUser
		});
	}

	public async logoutMetDeleteWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const tokenService: any = this.service.useService('Token');

		const { serviceError, serviceMsg } = await tokenService.removeToken(
			req.user.userId
		);

		if (serviceError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: serviceMsg
			});
		}

		res.cookie('accessToken', 'logout', {
			httpOnly: false,
			secure: true,
			signed: true,
			expires: new Date(Date.now()),
			sameSite: 'none'
		});

		res.cookie('refreshToken', 'logout', {
			httpOnly: false,
			secure: true,
			signed: true,
			expires: new Date(Date.now()),
			sameSite: 'none'
		});

		return res.status(statusCodes.OK).json({
			msg: 'user logged out!'
		});
	}
}
