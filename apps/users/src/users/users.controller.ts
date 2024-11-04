import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Ctx, MessagePattern } from '@nestjs/microservices';
import {
  CreateUserDto,
  createUserSchema,
} from '@app/contracts/users-client/users/create-user.dto';
import { USERS_PATTERNS } from '@app/contracts/users-client/users/users.pattern';
import { User } from 'apps/users/src/users/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { CheckUniquenessService } from '../common/check-uniqueness.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ZodValidationPipe } from '../common/validation.pipe';
import { AuthzGuard } from '../common/authz.guard';
import { z } from 'zod';
import { Permissions } from '@app/contracts/common/permissions';
import { MetadataInterceptor } from '../common/metadata.interceptor';
import ExtractedPayloadDec from '../common/extract-payload.decorator';
import { PermissionsDec } from '../common/permissions.decorator';
import { PermissionsGuard } from '../common/permissions.guard';
import { AdminGuard } from '../common/admin.guard';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    readonly authService: AuthService,
    private readonly checkUniqunessService: CheckUniquenessService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  @UseGuards(AuthzGuard, PermissionsGuard)
  @PermissionsDec([Permissions.VIEW_USERS])
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @MessagePattern(USERS_PATTERNS.CREATE)
  async create(
    @ExtractedPayloadDec(new ZodValidationPipe(createUserSchema))
    createUserDto: CreateUserDto,
  ) {
    await this.checkUniqunessService.check(
      this.userModel,
      'email',
      createUserDto.email,
    );

    const createdUserWithoutPass =
      await this.usersService.create(createUserDto);

    const token = this.authService.generateAuthToken(createdUserWithoutPass);

    return { token, user: createdUserWithoutPass };
  }

  @MessagePattern(USERS_PATTERNS.UPDATE_USER_PERMISSIONS)
  @UseInterceptors(MetadataInterceptor)
  @UseGuards(AuthzGuard, AdminGuard)
  async updateUserPermissions(
    @ExtractedPayloadDec(
      new ZodValidationPipe(z.array(z.nativeEnum(Permissions)).min(1)),
    )
    permissions: Permissions[],
    @Ctx() ctx: any,
  ) {
    const userId = ctx?.metadata?.params?.userId;

    const createdUserWithoutPass =
      await this.usersService.updateUserPermissions(userId, permissions);

    const token = this.authService.generateAuthToken(createdUserWithoutPass);

    return { token, user: createdUserWithoutPass };
  }
}
