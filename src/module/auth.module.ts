import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrastegy } from 'src/auth/local.strategy';
import { AuthController } from 'src/controllers/auth.controller';
import { UserEntity } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { jwtConstants } from 'src/constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthEntity } from 'src/entities/auth.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([UserEntity, AuthEntity]),
  ],
  controllers: [AuthController],
  providers: [LocalStrastegy, AuthService, UserService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
