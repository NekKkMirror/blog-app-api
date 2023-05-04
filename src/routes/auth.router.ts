import { AuthController } from '../controllers/index.contollers';
import { BaseRouter } from './base.router';

export class AuthRouter extends BaseRouter {
	constructor(private readonly controller: AuthController) {
		super('auth');
		this.initialize(this);
	}
}
