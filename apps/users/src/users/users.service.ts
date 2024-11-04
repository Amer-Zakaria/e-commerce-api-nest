/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from 'apps/users/src/users/schemas/user.schema';
import { Error, Model } from 'mongoose';
import { CreateUserDto } from '@app/contracts/users-client/users/create-user.dto';
import * as bcrypt from 'bcrypt';
import CustomRpcException from '@app/contracts/error/CustomRpcException';
import { ERROR_TYPE } from '@app/contracts/error/error-types';
import { Permissions } from '@app/contracts/common/permissions';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    //hashing the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const createdUser = await this.userModel
      .create(createUserDto)
      .catch((err) => {
        throw new CustomRpcException({
          code: ERROR_TYPE.MONGOOSE,
          validation: err,
        });
      });
    const { password, ...createdUserWithoutPass } = (createdUser as any)._doc;

    return createdUserWithoutPass;
  }

  async updateUserPermissions(userId: string, permissions: Permissions[]) {
    const user = await this.userModel.findById(userId);

    if (!user)
      throw new CustomRpcException({
        code: ERROR_TYPE.NOT_FOUND,
        message: `User with the id ${userId} doesn't exist`,
      });

    user.set({
      permissions,
    });

    const createdUser = await user
      .save()
      .catch((error: Error.ValidationError) => {
        throw new CustomRpcException({
          code: ERROR_TYPE.MONGOOSE,
          validation: error,
        });
      });

    const { password, ...createdUserWithoutPass } = (createdUser as any)._doc;

    return createdUserWithoutPass;
  }
}
