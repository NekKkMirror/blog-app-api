import { BlogController } from '../controllers/index.contollers';
import { BaseRouter } from './base.router';

export class BlogRouter extends BaseRouter {
	constructor(private readonly controller: BlogController) {
		super('blog');
		this.initialize(this);
	}
}
