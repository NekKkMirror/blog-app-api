import { DIContainer } from './di.container';
import * as services from '../services/index.service';
import * as controllers from '../controllers/index.contollers';

const dIContainer = new DIContainer();

const toAdd = {
	groupNodes: {
		controllers,
		services
	},
	singleNodes: {}
};

const fSingleNodes = nodes => {
	Object.keys(nodes).forEach(key => {
		dIContainer.factory({
			name: key,
			factory: nodes[key]
		});
	});
};

const fGroupNodes = nodes => {
	Object.keys(nodes).forEach(key => {
		dIContainer.gettingFactories({
			groupName: key,
			moduleImport: nodes[key]
		});
	});
};

fGroupNodes(toAdd.groupNodes);

export { dIContainer };
