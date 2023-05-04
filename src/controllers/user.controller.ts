import { server } from '../dependencies/index.dependencies';
import { NextFunction, Request, Response } from 'express';
import {
	createTokenUser,
	attachCookieToResponse,
	checkPermission
} from '../utils/index.util';
import { UserService } from '../services/index.service';
import { TokenI } from '../utils/create-token.util';
import { BaseController } from './base.controller';

const statusCodes = server.statusCode;

export class UserController extends BaseController {
	constructor(protected readonly service: UserService) {
		super();
		this.setContext(this);
	}

	public async slashMetGetWiAuserApermadmOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const {
			serviceError,
			serviceMsg,
			serviceItem: users
		} = await this.service.findAllUsers();

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.OK).json({
			serviceMsg,
			users,
			length: users.length
		});
	}

	public async showMeMetGetWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { userId } = req.user;

		const {
			serviceError,
			serviceMsg,
			serviceItem: currentUser
		} = await this.service.singleUserGet(userId);

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		const userToken = createTokenUser(currentUser);

		return res.status(statusCodes.OK).json({
			msg: serviceMsg,
			user: userToken
		});
	}

	public async parmIdMetGetWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const {
			serviceError,
			serviceMsg,
			serviceItem: user
		} = await this.service.singleUserGet(req.params.id);

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		const { permissionError, permissionStatus, permissionMsg }: any =
			checkPermission(req.user, user._id);

		if (permissionError) {
			return res.status(permissionStatus).json({
				msg: permissionMsg
			});
		}

		return res.status(statusCodes.OK).json({
			msg: serviceMsg,
			user
		});
	}

	public async parmIdMetPatchWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { userId } = req.user;

		if (Object.keys(req.body).length < 1) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: 'Please provide all values'
			});
		}

		const {
			serviceError,
			serviceMsg,
			serviceItem: fillUser
		} = await this.service.updateUser(userId, req.body);

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		const tokenUser: TokenI = createTokenUser(fillUser);
		const serviceToken: any = this.service.useService('Token');

		const exsistingToken = await serviceToken.findToken(userId);

		attachCookieToResponse({
			res,
			user: tokenUser,
			refreshToken: exsistingToken.refreshToken
		});

		await fillUser.save();

		return res.status(statusCodes.OK).json({
			msg: serviceMsg,
			user: tokenUser
		});
	}

	public async updateUserPasswordMetPatchWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { oldPassword, newPassword } = req.body;
		const { userId } = req.user;

		if (!oldPassword || !newPassword) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: 'Please provide all values'
			});
		}

		const {
			serviceError,
			serviceMsg,
			serviceItem: user
		} = await this.service.findUser(userId, null, true);

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		const isCorrectPassword: boolean = user.comparePassword(
			oldPassword,
			user.password
		);

		if (!isCorrectPassword) {
			return res.status(statusCodes.UNAUTHORIZED).json({
				msg: 'Invalid Credentials'
			});
		}

		user.password = newPassword;

		await user.save();

		return res.status(statusCodes.OK).json({
			msg: 'Success! Password Updated.'
		});
	}
}
