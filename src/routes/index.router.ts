// eslint-disable-next-line import/namespace
import { dIContainer } from '../container/index.container';
import { BaseRouter } from './base.router';

const controllers = dIContainer.getGroupFactories('controllers');
const services = dIContainer.getGroupFactories('services');

const promiseRoutesArr = Object.keys(controllers).map(async Controller => {
	const regExpForController = /\w+?(?=Controller)/gi;
	const regExpObj: RegExpMatchArray | null =
		Controller.match(regExpForController);

	const name: string | boolean = regExpObj ? regExpObj[0] : false;
	const Router: typeof BaseRouter = (
		await import(
			`./${name.toString().toLowerCase()}.router.${
				process.env.NODE_ENV === 'development' ? 'ts' : 'js'
			}`
		)
	)[name + 'Router'];
	const Service = services[name + 'Service'];

	return new Router(new controllers[Controller](new Service()));
});

export const routes: Promise<BaseRouter>[] = promiseRoutesArr;
