import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

function formateErrors(errors) {
	return errors
		.array()
		.map(err => {
			if (err.msg !== 'Invalid value') return err.msg;

			return ' ';
		})
		.join(' ')
		.trim()
		.split('   ')
		.join('; ');
}

function validateRequestSchema(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const msg = formateErrors(errors);

		return res.status(400).json({
			msg
		});
	}

	return next();
}

const requestBodyValidationChainForRegister = [
	body('name')
		.exists({
			checkFalsy: true,
			checkNull: true
		})
		.isString()
		.isLength({
			min: 3,
			max: 50
		})
		.withMessage('Username need 3 more characters'),

	body('email')
		.exists({
			checkFalsy: true,
			checkNull: true
		})
		.isString()
		.isEmail()
		.normalizeEmail()
		.withMessage('Type correct email in email field'),

	body('password')
		.exists({
			checkFalsy: true,
			checkNull: true
		})
		.isString()
		.isLength({
			min: 8
		})
		// .isStrongPassword({
		// minLowercase: 2,
		// minUppercase: 1,
		// minNumbers: 3
		// })
		.withMessage('Password need 8 more characters'),

	validateRequestSchema
];

const requestBodyValidationChainForLogin = [
	body('email')
		.exists({
			checkFalsy: true,
			checkNull: true
		})
		.isString()
		.isEmail()
		.normalizeEmail()
		.withMessage('Type correct email in email field'),

	body('password')
		.exists({
			checkFalsy: true,
			checkNull: true
		})
		.isString()
		.isLength({
			min: 8
		})
		.withMessage('Password need 8 more characters'),

	validateRequestSchema
];

export const authChain = {
	register: requestBodyValidationChainForRegister,
	login: requestBodyValidationChainForLogin
};
