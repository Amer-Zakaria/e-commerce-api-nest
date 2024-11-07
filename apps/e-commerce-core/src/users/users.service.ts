/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from 'apps/users/src/users/schemas/user.schema';
import { Error, Model } from 'mongoose';
import { CreateUserDto } from '@app/contracts/users-client/users/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ERROR_TYPE } from '@app/contracts/error/error-types';
import { Permissions } from '@app/contracts/common/permissions';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    private readonly authService: AuthService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async create(createUserDto: CreateUserDto) {
    //hashing the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const createdUser = await this.userModel
      .create(createUserDto)
      .catch((err: Error.ValidationError) => {
        throw new BadRequestException(ERROR_TYPE.MONGOOSE, {
          cause: err,
        });
      });
    const { password, ...createdUserWithoutPass } = (createdUser as any)._doc;

    const token = this.authService.generateAuthToken(createdUserWithoutPass);

    return { token, user: createdUserWithoutPass };
  }

  async updateUserPermissions(user: IUser, permissions: Permissions[]) {
    user.set({
      permissions,
    });

    const createdUser = await user
      .save()
      .catch((error: Error.ValidationError) => {
        throw new BadRequestException(ERROR_TYPE.MONGOOSE, {
          cause: error,
        });
      });

    const { password, ...createdUserWithoutPass } = (createdUser as any)._doc;

    const token = this.authService.generateAuthToken(createdUserWithoutPass);

    return { token, user: createdUserWithoutPass };
  }
}
