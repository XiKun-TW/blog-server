import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BlogEntity } from 'src/entities/blog.entity';
import { UserEntity } from 'src/entities/user.entity';

export class AuthSuccessResponse {
  @ApiProperty()
  JWT: string;
}

export class ErrorResponse {
  @ApiProperty()
  message: string;
}

export class CommonInsertResponse {
  @ApiProperty()
  id: string;
}

export class BlogThumbUpRequest {
  @ApiProperty({ description: 'blog id' })
  id: string;
}

export class SimpleBlogEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({
    description: 'auto create by backend, current is pick first 300 charactors',
  })
  description: string;

  @ApiProperty()
  auther: UserEntity;

  @ApiProperty()
  thumbUp: number;
}

export class PostBlogEntity {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
}

export class PutBlogEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
}

export class BlogDetailEntity extends SimpleBlogEntity {
  @ApiProperty()
  content: string;
}

export class BlogListResponse {
  @ApiProperty({ type: SimpleBlogEntity, isArray: true })
  result;
  @ApiProperty()
  count: number;
}

export class ThumbUpResponse {
  @ApiProperty()
  thumbUp: number;
}
