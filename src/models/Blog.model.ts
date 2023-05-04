import { server } from '../dependencies/index.dependencies';

const mongo = server.mongo;

const BlogSchema = new mongo.Schema(
	{
		author: {
			type: String,
			trim: true,
			required: [true, 'Please provide blog author'],
			index: true,
			maxlength: [30, 'Name can not be more than 30 characters']
		},
		message: {
			type: String,
			trim: true,
			required: [true, 'Please provide blog message'],
			maxlength: [200, 'Name can not be more than 200 characters']
		}
	},
	{
		timestamps: true,
		strict: false
	}
);

export const Blog = mongo.model('Blog', BlogSchema);
