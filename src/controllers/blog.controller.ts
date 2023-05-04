import { server } from '../dependencies/index.dependencies';
import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { BlogService } from '../services/index.service';
import { BaseController } from './base.controller';

const statusCodes = server.statusCode;

export class BlogController extends BaseController {
	constructor(protected readonly service: BlogService) {
		super();
		this.setContext(this);
	}

	public async searchMetGetWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const {
			serviceError,
			serviceMsg,
			serviceItem: newBlogs
		} = await this.service.search(req.query);

		if (serviceError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.OK).json({
			msg: serviceMsg,
			newBlogs,
			length: newBlogs.length
		});
	}

	public async slashMetGetWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const {
			serviceError,
			serviceMsg,
			serviceItem: products
		} = await this.service.findAllBlogs();

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.OK).json({
			msg: serviceMsg,
			products,
			count: products.length
		});
	}

	public async parmIdMetGetWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { id: blogId } = req.params;

		const {
			serviceError,
			serviceMsg,
			serviceItem: blog
		} = await this.service.findBlog(blogId);

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.OK).json({
			msg: serviceMsg,
			blog
		});
	}

	public async slashMetPostWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const {
			serviceError,
			serviceMsg,
			serviceItem: newBlog
		} = await this.service.createBlog(req.body);

		if (serviceError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.CREATED).json({
			msg: serviceMsg,
			newBlog
		});
	}

	public async bulkMetPostWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const {
			serviceError,
			serviceMsg,
			serviceItem: newBlogs
		} = await this.service.createBlogs(req.body);

		if (serviceError) {
			return res.status(statusCodes.BAD_REQUEST).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.CREATED).json({
			msg: serviceMsg,
			newBlogs
		});
	}

	public async parmIdMetPatchWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { id: blogId } = req.params;

		const {
			serviceError,
			serviceMsg,
			serviceItem: updatedBlog
		} = await this.service.updateBlog(blogId, req.body);

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.CREATED).json({
			msg: serviceMsg,
			updatedBlog
		});
	}

	public async parmIdMetDeleteWiAuserOe(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { id: blogId } = req.params;

		const { serviceError, serviceMsg } = await this.service.removeBlog(blogId);

		if (serviceError) {
			return res.status(statusCodes.NOT_FOUND).json({
				msg: serviceMsg
			});
		}

		return res.status(statusCodes.OK).json({
			msg: serviceMsg
		});
	}
}
