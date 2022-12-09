import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from 'src/entities/blog.entity';
import { ThumbUpEntity } from 'src/entities/thumbup.entity';
import { UserEntity } from 'src/entities/user.entity';
import { getDescriptionText, getSafeHtml } from 'src/utils/domPurify';
import { PostBlogEntity, PutBlogEntity } from 'src/utils/swaggerTypes';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepo: Repository<BlogEntity>,
    @InjectRepository(ThumbUpEntity)
    private readonly thumbRepo: Repository<ThumbUpEntity>,
  ) {}

  async getBlogList(user: UserEntity, pageNumber, pageCount) {
    const [result, count] = await this.blogRepo.findAndCount({
      where: {
        userId: user.id,
      },
      select: ['id', 'title', 'description', 'createTime', 'updateTime'],
      skip: (pageNumber - 1) * pageCount,
      take: pageCount,
    });

    const mappedResult = await Promise.all(
      result.map((blog) => this._getBlogResponseBody(user, blog)),
    );

    return {
      result: mappedResult,
      count,
    };
  }

  async getBlogById(user: UserEntity, blogId: string) {
    const blog = await this.blogRepo.findOneBy({ id: blogId });

    if (!blog) {
      throw new HttpException(
        { message: 'Blog not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this._getBlogResponseBody(user, blog);
  }

  async addBlog(user: UserEntity, blog: PostBlogEntity) {
    const description = getDescriptionText(blog.content, 300) + '...';
    const content = getSafeHtml(blog.content);
    const result = this.blogRepo.insert({
      ...blog,
      userId: user.id,
      description,
      content,
    });

    return {
      ...(await result).generatedMaps[0],
      description,
      thumbUp: 0,
      auther: user,
    };
  }

  async editBlog(user: UserEntity, blog: PutBlogEntity) {
    const { id, content, ...others } = blog;
    const updatedContent = content ? { content: getSafeHtml(content) } : {};
    const updatedDescription = content
      ? { description: getDescriptionText(content, 300) + '...' }
      : {};

    const result = this.blogRepo.update(
      { id },
      {
        ...others,
        ...updatedContent,
        ...updatedDescription,
      },
    );

    if ((await result).affected > 0)
      return {
        ...others,
        id,
        ...updatedDescription,
        ...(await result).generatedMaps[0],
        auther: user,
        thumbUp: await this._getThumbUpCount(blog.id),
      };

    throw new HttpException(
      { message: 'Resource not found' },
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteBlog(blogId: string) {
    const result = this.blogRepo.delete({ id: blogId });
    if ((await result).affected > 0) {
      return;
    }

    throw new HttpException(
      { message: 'Resource not found' },
      HttpStatus.NOT_FOUND,
    );
  }

  async thumbUpBlog(userId: string, blogId: string) {
    const blog = await this.blogRepo.findOneBy({ id: blogId });

    if (!blog) {
      throw new HttpException(
        { messsage: 'Blog not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const thumbCount = await this.thumbRepo.countBy({ blogId });
    const thumbBlog = await this._checkIfAlreadyThumbUp(userId, blogId);
    if (thumbBlog) {
      const deleteResult = await this.deleteThumbUp(userId, blogId);

      if (deleteResult.affected > 0) {
        return { thumbUp: thumbCount - 1 };
      }
    }
    const addResult = await this.addThumbUp(userId, blogId);

    if (addResult.identifiers.length > 0) {
      return {
        thumbUp: thumbCount + 1,
      };
    }

    throw new HttpException(
      { message: 'blog id or user id is not correct' },
      HttpStatus.NOT_FOUND,
    );
  }

  private async addThumbUp(userId: string, blogId: string) {
    return this.thumbRepo.insert({ userId, blogId });
  }

  private async deleteThumbUp(userId: string, blogId: string) {
    return this.thumbRepo.delete({ userId, blogId });
  }

  private async _checkIfAlreadyThumbUp(userId: string, blogId: string) {
    return this.thumbRepo.findOneBy({ userId, blogId });
  }

  private async _getBlogResponseBody(user: UserEntity, blog: BlogEntity) {
    return {
      ...blog,
      auther: user,
      thumbUp: await this._getThumbUpCount(blog.id),
    };
  }

  private async _getThumbUpCount(blogId: string) {
    return this.thumbRepo.countBy({ blogId });
  }
}
