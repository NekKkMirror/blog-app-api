import { NextFunction, Request, Response } from 'express';
import { isValidToken } from '../utils/index.util';

declare global {
	namespace Express {
		interface Request {
			user: any;
		}
	}
}

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let token;

	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith('Bearer')) {
		token = authHeader.split(' ')[1];
	} else if (req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		return res.status(401).json({
			msg: 'Authentication Invalid'
		});
	}

	const payload: any = isValidToken(token);

	req.user = {
		userId: payload.user.userId,
		role: payload.user.userRole
	};

	return next();
};

export const authorizeRoles = (...roles) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				msg: 'Unauthorized to access this route'
			});
		}

		return next();
	};
};
