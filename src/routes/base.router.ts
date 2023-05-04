import { server } from '../dependencies/index.dependencies';
import * as core from 'express-serve-static-core';
import { AutoRouter, IAutoRouter } from '../utils/index.util';
import { asyncMiddleware } from '../middleware/async.middleware';

export class BaseRouter {
	public router: core.Router = server.express.Router();

	constructor(public readonly routerType: string) {}

	protected initialize(router): void {
		router.controller.controllerMethods.forEach(async method => {
			const regexp =
				/(?<routPath>.+?)Met(?<routMethod>.+?)Wi((?<routOptions>.+?)Oe)?/i;

			const autoRouter: IAutoRouter = new AutoRouter(
				this.routerType,
				method,
				regexp,
				router
			);

			const { routMethod, routPath, routMiddleware, controllerMethod } =
				await autoRouter.run();

			this.router[routMethod](
				routPath,
				routMiddleware || [],
				asyncMiddleware(controllerMethod)
			);
		});
	}
}
