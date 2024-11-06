import {
  CreateUserDto,
  createUserSchema,
} from '@app/contracts/users-client/users/create-user.dto';
import { Response } from 'express';
import { Permissions } from '@app/contracts/common/permissions';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '../common/validation.pipe';
import objectIdSchema from '@app/contracts/common/objectIdSchema';
import { AuthzGuard } from '../common/authz.guard';
import { PermissionsGuard } from '../common/permissions.guard';
import { PermissionsDec } from '../common/permissions.decorator';
import { AdminGuard } from '../common/admin.guard';
import { z } from 'zod';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CheckUniquenessService } from '../common/check-uniqueness.service';
import { CheckExistenceService } from '../common/check-existence.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly checkUniqunessService: CheckUniquenessService,
    private readonly checkExistenceService: CheckExistenceService,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.VIEW_USERS])
  @Get()
  async findAll() {
    const result = await this.usersService.findAll();
    return result;
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.checkUniqunessService.check(
      this.userModel,
      'email',
      createUserDto.email,
    );

    const result = await this.usersService.create(createUserDto);
    const { token, user } = result as any;
    res.header('x-auth-token', token).status(201).json(user);
  }

  @Patch(':id')
  @UseGuards(AuthzGuard, AdminGuard)
  async updateUserPermissions(
    @Body(new ZodValidationPipe(z.array(z.nativeEnum(Permissions)).min(1)))
    permissions: Permissions[],
    @Param('id', new ZodValidationPipe(objectIdSchema)) userId: string,
    @Res() res: Response,
  ) {
    const user = await this.checkExistenceService.check<IUser>(
      this.userModel,
      userId,
    );

    const result = await this.usersService.updateUserPermissions(
      user,
      permissions,
    );

    const { token, user: createdUser } = result as any;

    res.header('x-auth-token', token).status(201).json(createdUser);
  }
}
