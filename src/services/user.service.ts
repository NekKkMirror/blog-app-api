import { User } from '../models/User.model';
import { Types } from 'mongoose';
import { BaseService } from './base.service';
import { fillBodyUpdate } from '../utils/index.util';

export class UserService extends BaseService {
	constructor() {
		super('User', User);
	}

	public async findUser(
		id: string | null,
		email: string | null = null,
		password = false
	) {
		const forSearch: Types.ObjectId | string =
			email === null ? this.makeIdForSearch(String(id)) : email;

		const selectPassword: string = password ? '+password' : '-password';

		const user =
			email === null
				? await this.model.findOne({ _id: forSearch }).select(selectPassword)
				: await this.model.findOne({ email: forSearch }).select(selectPassword);

		if (!user) {
			return this.sendToController(true, 'No user yet');
		}

		return this.sendToController(false, 'User successfully founded', user);
	}

	public async findAllUsers() {
		const users = await this.model
			.find({
				role: 'user'
			})
			.select('-password')
			.sort('createdAt');

		if (users.length < 1) {
			return this.sendToController(true, 'No users yet');
		}

		return this.sendToController(false, 'Users successfully found', users);
	}

	public async singleUserGet(id: string) {
		const idForSearch: Types.ObjectId = this.makeIdForSearch(id);

		const user = await this.model
			.findOne({
				_id: idForSearch
			})
			.select('-password');

		if (!user) {
			return this.sendToController(true, 'No user yet');
		}

		return this.sendToController(false, 'User successfully founded', user);
	}

	public async updateUser(id: string, body: object) {
		const idForSearch: Types.ObjectId = this.makeIdForSearch(id);

		const user = await this.checkItem(idForSearch);

		if (!user) {
			return this.sendToController(true, 'No user yet');
		}

		const fillUser = fillBodyUpdate(user, body);

		return this.sendToController(
			false,
			'Parameters added to the user',
			fillUser
		);
	}
}
