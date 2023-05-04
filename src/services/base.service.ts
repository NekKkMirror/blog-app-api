import { server } from '../dependencies/index.dependencies';
import { Mongoose, Types } from 'mongoose';
import { BlogService, UserService, TokenService } from './index.service';

const mongo = server.mongo;

export class BaseService {
	services: {
		Product: typeof BlogService;
		User: typeof UserService;
		Token: typeof TokenService;
	};

	db: Mongoose;

	constructor(private readonly serviceName: string, readonly model: any) {
		this.db = mongo;
		this.model = model;

		this.services = {
			Product: BlogService,
			User: UserService,
			Token: TokenService
		};
	}

	public useService(serviceName: string) {
		return new this.services[serviceName]();
	}

	protected async checkItem(itemId: Types.ObjectId): Promise<any> {
		const item = await this.model.findOne({
			_id: itemId
		});

		return item;
	}

	protected makeIdForSearch(id: string): Types.ObjectId {
		return new this.db.Types.ObjectId(id);
	}

	protected sendToController(
		serviceError: boolean | Array<any>,
		serviceMsg: string,
		serviceItem?: any
	): {
		serviceError: boolean | Array<any>;
		serviceMsg: string;
		serviceItem?: any;
	} {
		if (serviceError) {
			return {
				serviceError,
				serviceMsg
			};
		}

		return {
			serviceError,
			serviceMsg,
			serviceItem
		};
	}
}
