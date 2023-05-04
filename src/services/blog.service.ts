import { Blog } from '../models/Blog.model';
import { Types } from 'mongoose';
import { BaseService } from './base.service';

export class BlogService extends BaseService {
	constructor() {
		super('Blog', Blog);
	}

	public async findBlog(id: string) {
		const idForSearch: Types.ObjectId = this.makeIdForSearch(id);

		const blog = await this.checkItem(idForSearch);

		if (!blog) {
			return this.sendToController(true, 'No blog yet');
		}

		return this.sendToController(false, 'Blog successfully found', blog);
	}

	public async findAllBlogs() {
		const blogs = await this.model.find({});

		if (blogs.length < 1) {
			return this.sendToController(true, 'No blogs yet');
		}

		return this.sendToController(false, 'Blogs successfully found', blogs);
	}

	public async createBlog(body: object) {
		const newBlog = await this.model.create(body);

		if (!newBlog) {
			return this.sendToController(true, 'Blog cannot be made');
		}

		return this.sendToController(false, 'Blog successfully created', newBlog);
	}

	public async createBlogs(bodyBlogs: Array<object>) {
		const newBlogs = await Promise.all(
			bodyBlogs.map(body => this.model.create(body))
		);

		if (!newBlogs) {
			return this.sendToController(true, 'Blogs cannot be made');
		}

		return this.sendToController(false, 'Blogs successfully created', newBlogs);
	}

	public async updateBlog(id: string, body: object) {
		const idForSearch: Types.ObjectId = this.makeIdForSearch(id);

		const updatedBlog = await this.model.findOneAndUpdate(
			{
				_id: idForSearch
			},
			{
				$set: body
			},
			{
				new: true,
				runValidators: true
			}
		);

		if (!updatedBlog) {
			return this.sendToController(true, 'No blog yet');
		}

		return this.sendToController(
			false,
			'Blog successfully updated',
			updatedBlog
		);
	}

	public async removeBlog(id: string) {
		const idForSearch: Types.ObjectId = this.makeIdForSearch(id);

		const blog = await this.checkItem(idForSearch);

		if (!blog) {
			return this.sendToController(true, 'No blog yet');
		}

		await blog.remove();

		return this.sendToController(false, 'Blog successfully deleted');
	}

	public async search(query) {
		const { page, limit, search_term, order } = query;

		const pagination = {
			page: Number(page || 1),
			limit: Number(limit || 15)
		};
		const skippedItems = (pagination.page - 1) * pagination.limit;
		const searchRegExp = new RegExp(`.*${search_term}.*`);
		const orderBy = order || 'id';

		const checkOrderPrefix = orderBy.startsWith('-');
		const sort = {
			[checkOrderPrefix ? orderBy.substring(1) : orderBy]: checkOrderPrefix
				? -1
				: 1
		};

		const find = search_term
			? {
					$or: [
						{
							author: searchRegExp
						},
						{
							message: searchRegExp
						}
					]
			  }
			: {};

		const blogs = await this.model
			.find(find)
			.limit(limit)
			.sort(sort)
			.skip(skippedItems);

		if (!blogs) {
			return this.sendToController(true, 'Blogs not found');
		}

		return this.sendToController(false, 'Blogs successfully founded', blogs);
	}
}
