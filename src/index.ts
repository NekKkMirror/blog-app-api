import { App, PORT } from './app/App.application';
import { config, builtIn } from './dependencies/index.dependencies';

config({
	path: builtIn.path.join(
		builtIn.path.resolve(__dirname),
		'../config/config.env'
	)
});

const port: PORT = process.env.PORT || 3000;

const app = new App(port);
