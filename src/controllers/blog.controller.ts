import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlogService } from 'src/services/blog.service';
import {
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ErrorResponse,
  BlogDetailEntity,
  BlogListResponse,
  PostBlogEntity,
  PutBlogEntity,
  SimpleBlogEntity,
  ThumbUpResponse,
  CommonInsertResponse,
  BlogThumbUpRequest,
} from 'src/utils/swaggerTypes';

@ApiTags('blog')
@ApiBearerAuth('Bearer')
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ description: 'get blog list for user' })
  @UseGuards(JwtAuthGuard)
  @Get('blog')
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    description: 'page number, start from 1',
  })
  @ApiQuery({ name: 'count', type: Number, description: 'count per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BlogListResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponse,
  })
  async getBlog(
    @Req() req,
    @Query('pageNumber') pageNumber = 1,
    @Query('count') count = 20,
  ) {
    return this.blogService.getBlogList(req.user, pageNumber, count);
  }

  @ApiOperation({ description: 'get blog detile by blog id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BlogDetailEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'blog id' })
  @UseGuards(JwtAuthGuard)
  @Get('blog/:id')
  async getBlogById(@Req() req, @Param('id') id) {
    return this.blogService.getBlogById(req.user, id);
  }

  @ApiOperation({ description: 'post new blog' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BlogDetailEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Post('blog')
  async addBlog(@Req() req, @Body() body: PostBlogEntity) {
    console.log(body);
    return this.blogService.addBlog(req.user, body);
  }

  @ApiOperation({ description: 'update blog' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SimpleBlogEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Put('blog')
  async updateBlog(@Req() req, @Body() body: PutBlogEntity) {
    return this.blogService.editBlog(req.user, body);
  }

  @ApiOperation({ description: 'delete blog' })
  @ApiParam({ name: 'id', type: String, description: 'blog id' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('blog/:id')
  async deleteBlog(@Param('id') id) {
    return this.blogService.deleteBlog(id);
  }

  @ApiOperation({ description: 'thumb up or cancel thumb up a blog' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ThumbUpResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Post('thumb-up')
  async addThumbUp(@Req() req, @Body() body: BlogThumbUpRequest) {
    return this.blogService.thumbUpBlog(req.user.id, body.id);
  }
}
