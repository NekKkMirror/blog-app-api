import { isValidToken, attachCookieToResponse } from '../utils/index.util';
import { Token } from '../models/Token.model';
import { NextFunction, Request, Response } from 'express';

import { asyncMiddleware } from './async.middleware';

declare global {
	namespace Express {
		interface Request {
			user: any;
		}
	}
}

export const authenticateUser = asyncMiddleware(
	async (req: Request, res: Response, next: NextFunction) => {
		const { accessToken, refreshToken } = req.signedCookies;

		if (accessToken) {
			const payload: any = isValidToken(accessToken);
			req.user = payload.user;

			return next();
		}

		const payload: any = isValidToken(refreshToken);

		const existingToken = await Token.findOne({
			user: payload.user.userId,
			refreshToken: payload.refreshToken
		});

		if (!existingToken || !existingToken?.isValid) {
			return res.status(401).json({
				msg: 'Authentication Invalid'
			});
		}

		attachCookieToResponse({
			res,
			user: payload.user,
			refreshToken: existingToken.refreshToken
		});

		req.user = payload.user;

		return next();
	}
);

export const authorizePermissions = (...roles) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.userRole)) {
			return res.status(403).json({
				msg: 'Unauthorized to access this route'
			});
		}

		return next();
	};
};
