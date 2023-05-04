import { NextFunction, Request, Response } from 'express';

export class BaseController {
	context: any;
	controllerMethods: any;

	constructor() {}

	protected setContext(thisArg): void {
		this.context = thisArg;
		this.controllerMethods = Object.getOwnPropertyNames(
			this.context.__proto__
		).filter(el => el != 'constructor');

		this.setProxy();
	}

	private setProxy(): void {
		const contextBlockVariable = this.context;

		this.controllerMethods.forEach(controllerMethod => {
			this.context[controllerMethod] = new Proxy(
				this.context[controllerMethod],
				{
					apply(
						target,
						thisArg,
						args: [req: Request, res: Response, next: NextFunction]
					) {
						return target.apply(contextBlockVariable, args);
					}
				}
			);
		});
	}
}
