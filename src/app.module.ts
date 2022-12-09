import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './ormconfig';
import { UserModule } from './module/user.module';
import { AuthModule } from './module/auth.module';
import { BlogModule } from './module/blog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    PassportModule,
    UserModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
