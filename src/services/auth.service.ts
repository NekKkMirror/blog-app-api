import { User } from '../models/User.model';
import { BaseService } from './base.service';

export class AuthService extends BaseService {
	constructor() {
		super('Auth', User);
	}

	public async checkRegisterEmail(email: string) {
		const user = await this.model
			.findOne({
				email
			})
			.select('-password');

		if (user) {
			return this.sendToController(true, 'Email already exists');
		}

		return this.sendToController(false, 'User successfully not found');
	}

	public async findUserByEmail(email: string) {
		const user = await this.model.findOne({ email });

		if (!user) {
			return this.sendToController(true, 'No user yet');
		}

		return this.sendToController(false, 'User successfully founded', user);
	}

	public async createUser(body: object) {
		const newUser = await this.model.create(body);

		if (!newUser) {
			return this.sendToController(true, 'User cannot be created');
		}

		return this.sendToController(
			false,
			'Success! Please check your email to verify account',
			newUser
		);
	}
}
