import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthEntity } from 'src/entities/auth.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import {
  AuthSuccessResponse,
  CommonInsertResponse,
  ErrorResponse,
} from 'src/utils/swaggerTypes';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ description: 'login api' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthSuccessResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponse,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: UserEntity, @Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ description: 'register api' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthSuccessResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponse,
  })
  @Post('register')
  async register(@Body() body: UserEntity) {
    return this.authService.generateJWTResponse(
      await this.userService.createOne(body),
    );
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ description: 'blog menu api' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommonInsertResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/route')
  async addRoute(@Body() body: AuthEntity) {
    return this.authService.addRoute(body);
  }
}
