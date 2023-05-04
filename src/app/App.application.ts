import { Application } from 'express';
import {
	builtIn,
	middleware,
	server,
	swagger
} from '../dependencies/index.dependencies';
import { Server } from 'https';
import { initMorganToken } from '../utils/index.util';
import { errorHandlerFunction } from '../middleware/error-handler.middleware';
import { routes } from '../routes/index.router';

const express = server.express;
const https = server.https;
const mongo = server.mongo;
const MongoClient = server.MongoClient;
const ServerApiVersion = server.ServerApiVersion;

const fs = builtIn.fs;
const path = builtIn.path;

const clc = middleware.clc;
const cookieParser = middleware.cookieParser;
const cors = middleware.cors;
const mongoSanitize = middleware.mongoSanitize;
const morgan = middleware.morgan;
const rateLimiter = middleware.rateLimiter;
const fileUpload = middleware.fileUpload;

const connect = swagger.connector(swagger.api, swagger.apiDefinition);

export type PORT = number | string;

export class App {
	private readonly app: Application;

	constructor(private readonly port: PORT) {
		this.app = express();

		this.initialize(this.port);
	}

	private initialize(port: PORT): Server {
		this.setMiddleware();
		this.setRoutes();
		this.setErrorMiddleware();
		this.db();

		return this.setHttps().listen(port, (): void =>
			console.log(
				`Server listen at ${clc.underline.bold.cyan(
					`https://localhost:${port}`
				)}\n`
			)
		);
	}

	private setMiddleware(): void {
		this.app.set('trust proxy', 1);

		this.app.use(
			cors({
				origin: process.env.ORIGIN,
				optionsSuccessStatus: 200,
				credentials: true
			})
		);

		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', req.header('Origin'));
			res.header('Access-Control-Allow-Credentials', 'true');
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
			);
			res.header(
				'Access-Control-Allow-Methods',
				'GET, POST, OPTIONS, PUT, DELETE'
			);

			next();
		});

		this.app.use(
			rateLimiter({
				windowMs: 15 * 60 * 1000,
				max: 60,
				standardHeaders: true,
				legacyHeaders: false
			})
		);

		this.app.use(mongoSanitize());

		this.app.use(cookieParser(process.env.COOKIE_SECRET));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));

		initMorganToken();
		if (process.env.NODE_ENV === 'development') {
			this.app.use(
				morgan(` ${clc.bold.blue('INFO FROM REQUEST:')}
        ${clc.italic.blue('HOST:')} ${clc.underline.cyan(':remote-addr')}
        ${clc.italic.blue('DATE:')} ${clc.whiteBright('[:date[clf]]')}
        ${clc.italic.blue('METHOD:')} ${clc.redBright(':method')}
        ${clc.italic.blue('HTTP DATA:')} ${clc.red(':url HTTP/:http-version')}
        ${clc.italic.blue('STATUS:')} ${clc.green(':status')}\n`)
			);
		}
		this.app.use(fileUpload());
	}

	private setRoutes(): void {
		routes.forEach(async routPromise => {
			const routObj = await routPromise;

			this.app.use(`/api/v1/${routObj.routerType}`, routObj.router);
		});
	}

	private setErrorMiddleware(): void {
		this.app.use(errorHandlerFunction);
	}

	private setHttps(): Server {
		connect(this.app);

		return https.createServer(
			{
				cert: fs.readFileSync(
					path.join(path.resolve(path.join(__dirname, '../config/cert.pem')))
				),
				key: fs.readFileSync(
					path.join(path.resolve(path.join(__dirname, '../config/key.pem')))
				),
				passphrase: process.env.HTTPS_PASSPHRASE
			},
			this.app
		);
	}

	private async db() {
		mongo
			.connect(String(process.env.MONGO_CLUSTER_URI))
			.then(() =>
				console.log(clc.underline(clc.green('Success conn to mongoDB')))
			)
			.catch(err => console.log(clc.red(err)));
	}
}
