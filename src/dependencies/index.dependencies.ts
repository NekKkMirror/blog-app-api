// * server
import * as express from 'express';
import * as https from 'https';
import * as statusCode from 'http-status-codes';
import * as mongo from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as validator from 'validator';
import * as bcrypt from 'bcryptjs';
import { MongoClient, ServerApiVersion } from 'mongodb';

// * config
import { config } from 'dotenv';

// * middleware
import * as clc from 'cli-color';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as fileUpload from 'express-fileupload';
import * as rateLimiter from 'express-rate-limit';
import * as helmet from 'helmet';
import * as xss from 'xss-clean';
import * as cors from 'cors';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as expressValidator from 'express-validator';

// * built-in dependencies
import * as fs from 'fs';
import * as path from 'path';

// * swagger
import { connector } from 'swagger-routes-express';
import YAML = require('yamljs');

const api = require('../swagger/api');

const apiDefinition = YAML.load(
	path.resolve(path.join(__dirname, '../swagger/api.swagger.yaml'))
);

const swagger = {
	connector,
	api,
	apiDefinition
};

const middleware = {
	clc,
	cookieParser,
	morgan,
	fileUpload,
	rateLimiter,
	helmet,
	xss,
	cors,
	mongoSanitize,
	expressValidator
};

const server = {
	express,
	https,
	statusCode,
	mongo,
	jwt,
	crypto,
	nodemailer,
	validator,
	bcrypt,
	MongoClient,
	ServerApiVersion
};

const builtIn = {
	fs,
	path
};

export { middleware, server, config, builtIn, swagger };
