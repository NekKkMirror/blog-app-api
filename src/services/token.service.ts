import { Token } from '../models/Token.model';
import { Types } from 'mongoose';
import { BaseService } from './base.service';

export class TokenService extends BaseService {
	constructor() {
		super('Token', Token);
	}

	public async findToken(id: string) {
		const idForSearch: Types.ObjectId = this.makeIdForSearch(id);

		const token = await this.model.findOne({
			user: idForSearch
		});

		if (!token) {
			return this.sendToController(true, 'No token yet');
		}

		return this.sendToController(false, 'Token successfully found', token);
	}

	public async createToken(body: object) {
		const newToken = await this.model.create(body);

		if (!newToken) {
			return this.sendToController(true, 'Token cannot be created');
		}

		return this.sendToController(false, 'Token success created', newToken);
	}

	public async removeToken(userId: string) {
		const idForSearch: Types.ObjectId = this.makeIdForSearch(userId);

		const token = await this.model.findOneAndRemove({
			user: idForSearch
		});

		if (!token) {
			return this.sendToController(true, 'No token yet');
		}

		return this.sendToController(false, 'Token successfully deleted');
	}
}
