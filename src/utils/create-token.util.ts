import { Types } from 'mongoose';

export interface TokenI {
	username: string;
	userId: Types.ObjectId | string;
	userRole: string;
}

export function createTokenUser(user): TokenI {
	return {
		username: user.username,
		userId: user.id,
		userRole: user.role
	};
}
