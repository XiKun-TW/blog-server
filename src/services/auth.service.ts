import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Md5 } from 'md5-typescript';
import { AuthEntity } from 'src/entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepo: Repository<AuthEntity>,
    private jwtService: JwtService,
  ) {}

  async login(user: UserEntity) {
    const payload = { name: user.name, id: user.id };

    return this.generateJWTResponse(payload);
  }

  async validateUser(name: string, password: string) {
    const findUser = await this._checkIfUserExists(name);

    if (findUser && findUser.password === Md5.init(password)) {
      return findUser;
    }

    throw new HttpException(
      { message: 'Username or password is incorrect' },
      HttpStatus.NOT_FOUND,
    );
  }

  async addRoute(route: AuthEntity) {
    if (!route.name) {
      throw new HttpException(
        { message: 'Route name is required' },
        HttpStatus.FORBIDDEN,
      );
    }

    const findRoute = await this._checkIfRouteExists(route.name);

    if (!findRoute) {
      const insertResult = this.authRepo.insert(route);

      return {
        id: (await insertResult).identifiers[0]?.id,
      };
    }

    throw new HttpException(
      { message: 'Route already exists' },
      HttpStatus.FORBIDDEN,
    );
  }

  async generateJWTResponse(payload) {
    const permission = await this._getAllRoutes();
    return {
      JWT: this.jwtService.sign({
        ...payload,
        permission,
      }),
    };
  }

  private async _checkIfUserExists(userName: string) {
    return this.userRepo.findOne({ where: { name: userName } });
  }

  private async _getAllRoutes() {
    return this.authRepo.find();
  }

  private async _checkIfRouteExists(routeName: string) {
    return this.authRepo.findOne({ where: { name: routeName } });
  }
}
