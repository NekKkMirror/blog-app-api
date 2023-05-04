import * as parse from 'parse-fn-args'

type gettingFactoryProps = {
	groupName: string,
	moduleImport,
}

type factoryProps = {
	factory: string,
	name: string,
	groupName?: string
}

interface DIContainer {
	factories: {},
	dependencies: {},
	factory(factoryProps: factoryProps): void,
	gettingFactories(gettingFactoryProps: gettingFactoryProps): void
	register(name: string, dep: string): void,
	get(name: string),
	getWithGroup(name: string, groupName: string)
	inject(factory),
	getGroupDeps(groupName: string),
	getGroupFactories(groupName: string)
}

class DIContainer implements DIContainer  {
	static factories: {};
	static dependencies: {};

	constructor() {
		DIContainer.dependencies = {};
		DIContainer.factories = {}
	}

	gettingFactories(gettingFactoryProps): void {
		DIContainer.factories[gettingFactoryProps.groupName] = {};

		return Object.keys(gettingFactoryProps.moduleImport).forEach( name => {
			this.factory({
				factory: gettingFactoryProps.moduleImport[name],
				name,
				groupName: gettingFactoryProps.groupName
			});
		})

	}

	factory(factoryProps): void {
		const { factory, name } = factoryProps

		if (factoryProps.groupName) {
			DIContainer.factories[factoryProps.groupName][name] = factory;

			return;
		}

			DIContainer.factories[name] = factory;
	}

	register(name, dep): void {
		DIContainer.dependencies[name] = dep;
	}

	get(name) {
		if (!DIContainer.dependencies[name]) {
			const factory = DIContainer.factories[name];
			DIContainer.dependencies[name] = factory && this.inject(factory);
		}

		if (!DIContainer.dependencies[name]) {
			console.error(`Cannot find module ${name}`);
		}

		return DIContainer.dependencies[name];
	}

	getWithGroup(name, groupName) {
		if (!DIContainer.dependencies[groupName][name]) {
			const factory = DIContainer.dependencies[groupName][name];
			DIContainer.dependencies[groupName][name] = factory && this.inject(factory);
		}

		if (!DIContainer.dependencies[groupName][name]) {
			console.error(`Cannot find module ${name}`);
		}

		return DIContainer.dependencies[groupName][name];
	}

	inject(factory) {
		const args = parse(factory).map(dep => this.get(dep));

		return factory.apply(factory, args);
	}

	getGroupFactories(groupName) {
		if (!DIContainer.factories[groupName]) {
			console.log(`Cannot find factories group: ${groupName}`);
		}

		return DIContainer.factories[groupName];
	}

}

export {
	DIContainer
}