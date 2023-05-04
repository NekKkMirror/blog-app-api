import { server } from '../dependencies/index.dependencies';

const mongo = server.mongo;

const TokenSchema = new mongo.Schema(
	{
		refreshToken: {
			type: String,
			required: true
		},
		ip: {
			type: String,
			required: true
		},
		userAgent: {
			type: String,
			required: true
		},
		isValid: {
			type: Boolean,
			default: true
		},
		user: {
			type: mongo.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{ timestamps: true }
);

export const Token = mongo.model('Token', TokenSchema);
