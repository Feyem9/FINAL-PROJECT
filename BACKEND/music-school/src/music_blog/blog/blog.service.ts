import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateBlogDto } from 'src/DTO/blog.dto';
import { Blog } from 'src/schema/blog.schema';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    ) { }

    // async createBlog(data: Partial<Blog>, user: any): Promise<Blog> {
    //     try {
    //         if (!user || !user._id) {
    //             console.log('user', user);
    //             throw new ForbiddenException('Utilisateur non authentifié');

    //         }
    //         // Ensure the author is set to the current user
    //         if (data.author) {
    //             throw new ForbiddenException('L\'auteur ne peut pas être défini manuellement');
    //         }
    //         // dans createBlog ET updateBlog, juste avant d’appeler le service
    //         if (typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    //         if (typeof data.categories === 'string') data.categories = JSON.parse(data.categories);

    //         const blog = new this.blogModel({
    //             ...data,
    //             author: user._id,
    //             published: false,
    //             publishedAt: new Date(),
    //         });
    //         console.log('User in createBlog:', user);

    //         return await blog.save();
    //     } catch (error) {
    //         console.error('Error creating blog:', error);
    //         throw error; // Propagate the error to the global exception filter

    //     }
    // }

    async createBlog(title: string, content: string, image: string, tags: string[], categories: string[], author: Types.ObjectId | null): Promise<Blog> {
        try {
            const blog = new this.blogModel({
                title,
                content,
                image,
                tags,
                categories,
                author,
                published: false,
                publishedAt: new Date(),
            });
            return await blog.save();
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error; // Propagate the error to the global exception filter
        }
    }

    async getAllBlogs({ page = 1, limit = 10, search = '', tag = '', category = '', published = undefined }) {
        try {
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
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw error; // Propagate the error to the global exception filter

        }
    }

    async getBlogById(id: string) {
        try {
            const blog = await this.blogModel.findById(id).populate('author', 'name email').exec();
            if (!blog) throw new NotFoundException('Blog non trouvé');
            return blog;
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            throw new NotFoundException('Blog non trouvé'); // Propagate the error to the global exception filter
        }

    }

    async updateBlog(id: string, updateBlog: UpdateBlogDto, user: any, file?: Express.Multer.File): Promise<Blog> {
        try {
            const blog = await this.blogModel.findById(id).exec();
            if (!blog) throw new NotFoundException('Blog non trouvé');


            if (String(blog.author) !== String(user._id) && user.role !== 'admin') {
                throw new ForbiddenException('Vous ne pouvez modifier que vos propres blogs');
            }


            // Si une image est uploadée
            if (file) {
                updateBlog.image = `/uploads/${file.filename}`; // ou ton URL cloud
            }


            Object.assign(blog, updateBlog);
            return await blog.save();
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error; // Propagate the error to the global exception filter

        }
    }
    async deleteBlog(id: string, user: any): Promise<{ deleted: boolean }> {
        try {
            const blog = await this.blogModel.findById(id).exec();
            if (!blog) throw new NotFoundException('Blog non trouvé');
            if (String(blog.author) !== String(user._id) && user.role !== 'admin') {
                throw new ForbiddenException('Vous ne pouvez supprimer que vos propres blogs');
            }
            await blog.deleteOne();
            return { deleted: true };
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error; // Propagate the error to the global exception filter
        }
    }

    async addComment(blogId: string, user: any, comment: string) {
        try {
            const blog = await this.blogModel.findById(blogId).exec();
            if (!blog) throw new NotFoundException('Blog non trouvé');
            blog.comments.push({ user: user._id, comment, createdAt: new Date() });
            return await blog.save();
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error; // Propagate the error to the global exception filter
        }
    }

    async publishBlog(id: string, user: any) {
        try {
            const blog = await this.blogModel.findById(id).exec();
            if (!blog) throw new NotFoundException('Blog non trouvé');
            if (String(blog.author) !== String(user._id) && user.role !== 'admin') {
                throw new ForbiddenException('Vous ne pouvez publier que vos propres blogs');
            }
            blog.published = true;
            blog.publishedAt = new Date();
            return await blog.save();
        } catch (error) {
            console.error('Error publishing blog:', error);
            throw error; // Propagate the error to the global exception filter

        }
    }
}
