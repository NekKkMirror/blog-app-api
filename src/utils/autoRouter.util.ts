interface IAutoRouter {
	splitPath(path: string): string;
	lowerFirstWord(name: string): string;
	setRouterOptions(
		name: string,
		routOptions: string | undefined,
		routPrefix: string
	);
	checkRouterPath(path: string): string;
	checkRouterOption(option: string, name: string, routPrefix: string);
	run(): Promise<{
		routMethod;
		routPath;
		routMiddleware;
		controllerMethod;
	}>;
}

const listOfRouterOptions = {
	chain: {
		async start({ name, routPrefix }) {
			const importFile = await import('../validate/index.validator');

			return importFile[routPrefix + 'Chain'][name];
		}
	},
	auser: {
		// IF USING SWAGGER BEARER AUTH
		// async start() {
		// 	const importFile = await import('../middleware/full-auth.middleware');
		//
		// 	return importFile.authenticateUser;
		// }

		// TODO: set '../middleware/authentication.middleware' NOW BEARER
		async start() {
			const importFile = await import(
				'../middleware/authentication.middleware'
			);

			return importFile.authenticateUser;
		}
	},
	apermadm: {
		// IF USING SWAGGER BEARER AUTH
		// async start() {
		// 	const importFile = await import('../middleware/full-auth.middleware');
		//
		// 	return importFile.authorizeRoles('admin');
		// }

		// TODO: set '../middleware/authentication.middleware' NOW BEARER
		async start() {
			const importFile = await import(
				'../middleware/authentication.middleware'
			);

			return importFile.authorizePermissions('admin');
		}
	}
};

class AutoRouter implements IAutoRouter {
	constructor(
		private readonly routerType: string,
		private readonly method,
		private readonly regexpToParseRoutString,
		private readonly router
	) {
		this.method = method;
		this.regexpToParseRoutString = regexpToParseRoutString;
		this.routerType = routerType;
		this.router = router;
	}

	async run() {
		const group = this.method.match(this.regexpToParseRoutString).groups;

		const routName = this.splitPath(group.routPath);
		const routPath = '/' + routName;
		const routMethod = this.lowerFirstWord(group.routMethod);
		const routMiddleware = await this.setRouterOptions(
			routName,
			group.routOptions,
			this.routerType
		);
		const controllerMethod = this.router.controller[this.method];

		return {
			routMethod,
			routPath,
			routMiddleware,
			controllerMethod
		};
	}

	splitPath(path: string): string {
		let resultPath = path;
		if (path === 'slash' || path.startsWith('parm')) {
			return this.checkRouterPath(path);
		}

		let searchLineLength: any = 0;

		for (let i = 0; i < path.length; i++) {
			if (path[i] === path[i].toUpperCase()) {
				searchLineLength++;
			}
		}

		const regexpForCount = new RegExp(
			`(?<count>[A-Z]){1,${searchLineLength ? searchLineLength : 2}}`,
			'g'
		);

		Array.from(path.matchAll(regexpForCount)).forEach(match => {
			const word = match.groups?.count;
			const regexpForReplace = new RegExp(word ? word : '', 'g');

			resultPath = resultPath.replace(
				regexpForReplace,
				`-${word?.toLowerCase()}`
			);
		});

		return resultPath;
	}

	lowerFirstWord(name: string): string {
		const regexp = /(?<firstWord>\w)/;
		const firstWord = name.match(regexp)?.groups?.firstWord;

		return firstWord?.toLowerCase() + name.substring(1);
	}

	checkRouterPath(path: string): string {
		if (path !== 'slash') {
			return `:${this.lowerFirstWord(path.substring(4))}`;
		}

		return '';
	}

	async setRouterOptions(
		name: string,
		routOptions: string | undefined,
		routPrefix: string
	) {
		if (routOptions === undefined) return false;

		let routMiddleware: any[] = [];

		const dividedOptions = this.splitPath(routOptions).substring(1).split('-');

		for (let i = 0; i < dividedOptions.length; i++) {
			const routOption = await this.checkRouterOption(
				dividedOptions[i],
				name,
				routPrefix
			);

			routMiddleware.push(...routOption);
		}

		return routMiddleware;
	}

	async checkRouterOption(option: string, name: string, routPrefix: string) {
		const routMiddleware: any[] = [];

		if (listOfRouterOptions[option]) {
			if (option === 'chain') {
				routMiddleware.push(
					...(await listOfRouterOptions[option].start({
						name,
						routPrefix
					}))
				);

				return routMiddleware;
			}

			routMiddleware.push(await listOfRouterOptions[option].start());
		}

		return routMiddleware;
	}
}

export { AutoRouter, IAutoRouter };
