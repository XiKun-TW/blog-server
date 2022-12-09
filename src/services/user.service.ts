import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Md5 } from 'md5-typescript';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createOne(user: UserEntity) {
    this.checkPassword(user?.password);

    const findUser = await this._checkIfUserExists(user.name);

    if (!findUser) {
      const insertResult = this.userRepo.insert({
        ...user,
        password: Md5.init(user.password),
      });

      return {
        name: user.name,
        id: (await insertResult).identifiers[0]?.id,
      };
    }

    throw new HttpException(
      { message: 'User already exists' },
      HttpStatus.FORBIDDEN,
    );
  }

  async getOne(user: UserEntity) {
    return this.userRepo.findOne({ where: { id: user.id } });
  }

  async _checkIfUserExists(userName: string) {
    return this.userRepo.findOne({ where: { name: userName } });
  }

  private checkPassword(password: string) {
    if (!password || password.length < 6)
      throw new HttpException(
        { message: 'Password lenth must longer than 6' },
        HttpStatus.BAD_REQUEST,
      );
  }
}
