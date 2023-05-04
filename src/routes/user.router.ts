import { UserController } from '../controllers/index.contollers';

import { BaseRouter } from './base.router';

export class UserRouter extends BaseRouter {
	constructor(private readonly controller: UserController) {
		super('user');
		this.initialize(this);
	}
}
