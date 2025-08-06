import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from 'src/schema/blog.schema';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    ) { }

    async createBlog(data: Partial<Blog>, user: any): Promise<Blog> {
        const blog = new this.blogModel({
            ...data,
            author: user._id,
            published: false,
            publishedAt: null,
        });
        return await blog.save();
    }

    async getAllBlogs({ page = 1, limit = 10, search = '', tag = '', category = '', published = true }) {
        const query: any = {};
        if (search) query.title = { $regex: search, $options: 'i' };
        if (tag) query.tags = tag;
        if (category) query.categories = category;
        if (published !== undefined) query.published = published;

        const blogs = await this.blogModel
            .find(query)
            .populate('author', 'name email')
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const total = await this.blogModel.countDocuments(query);
        return { blogs, total, page, limit };
    }

    async getBlogById(id: string) {
        const blog = await this.blogModel.findById(id).populate('author', 'name email').exec();
        if (!blog) throw new NotFoundException('Blog non trouvé');
        return blog;
    }

    async updateBlog(id: string, data: Partial<Blog>, user: any): Promise<Blog> {
        const blog = await this.blogModel.findById(id).exec();
        if (!blog) throw new NotFoundException('Blog non trouvé');
        if (String(blog.author) !== String(user._id) && user.role !== 'admin') {
            throw new ForbiddenException('Vous ne pouvez modifier que vos propres blogs');
        }
        Object.assign(blog, data);
        return await blog.save();
    }

    async deleteBlog(id: string, user: any): Promise<{ deleted: boolean }> {
        const blog = await this.blogModel.findById(id).exec();
        if (!blog) throw new NotFoundException('Blog non trouvé');
        if (String(blog.author) !== String(user._id) && user.role !== 'admin') {
            throw new ForbiddenException('Vous ne pouvez supprimer que vos propres blogs');
        }
        await blog.deleteOne();
        return { deleted: true };
    }

    async addComment(blogId: string, user: any, comment: string) {
        const blog = await this.blogModel.findById(blogId).exec();
        if (!blog) throw new NotFoundException('Blog non trouvé');
        blog.comments.push({ user: user._id, comment, createdAt: new Date() });
        return await blog.save();
    }

    async publishBlog(id: string, user: any) {
        const blog = await this.blogModel.findById(id).exec();
        if (!blog) throw new NotFoundException('Blog non trouvé');
        if (String(blog.author) !== String(user._id) && user.role !== 'admin') {
            throw new ForbiddenException('Vous ne pouvez publier que vos propres blogs');
        }
        blog.published = true;
        blog.publishedAt = new Date();
        return await blog.save();
    }
}
