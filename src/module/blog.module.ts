import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { jwtConstants } from 'src/constants';
import { BlogEntity } from 'src/entities/blog.entity';
import { BlogService } from 'src/services/blog.service';
import { BlogController } from 'src/controllers/blog.controller';
import { ThumbUpEntity } from 'src/entities/thumbup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity, UserEntity, ThumbUpEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [BlogController],
  providers: [UserService, BlogService],
})
export class BlogModule {}
