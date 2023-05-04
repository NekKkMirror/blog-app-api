import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line import/no-unresolved
import { server } from '../dependencies/index.dependencies';

const sCode = server.statusCode;

export const errorHandlerFunction = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err);
	let customError = {
		// set default
		statusCode: err.statusCode || sCode.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later'
	};

	if (err.name === 'ValidationError') {
		customError.statusCode = 400;
	}

	if (err.statusCode && err.statusCode === 11000) {
		customError.msg = `Duplicate value entered for field, please choose another value`;
		customError.statusCode = 400;
	}

	if (err.name === 'CastError') {
		// id :
		customError.msg = 'No item found with ';
		customError.statusCode = 404;
	}

	return res.status(customError.statusCode).json({ msg: customError.msg });
};
