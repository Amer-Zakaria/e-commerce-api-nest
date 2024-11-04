import { CreateUserDto } from '@app/contracts/users-client/users/create-user.dto';
import { Response } from 'express';
import { Permissions } from '@app/contracts/common/permissions';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ZodValidationPipe } from '../common/validation.pipe';
import objectIdSchema from '@app/contracts/common/objectIdSchema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Headers('x-auth-token') token: string) {
    try {
      const result = await this.usersService.findAll(token).toPromise();
      return result;
    } catch (err) {
      throw new HttpException(err.code, err.status || 400, {
        cause: err.validation || err.message,
      });
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.usersService.create(createUserDto).toPromise();
      const { token, user } = result as any;
      res.header('x-auth-token', token).status(201).json(user);
    } catch (err) {
      throw new HttpException(err.code, err.status || 400, {
        cause: err.validation || err.message,
      });
    }
  }

  @Patch(':id')
  async updateUserPermissions(
    @Body()
    permissions: Permissions[],
    @Param('id', new ZodValidationPipe(objectIdSchema)) userId: string,
    @Headers('x-auth-token') token: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersService
        .updateUserPermissions({
          userId: userId,
          permissions,
          token: token,
        })
        .toPromise();

      const { token: generatedToken, user } = result as any;
      res.header('x-auth-token', generatedToken).status(201).json(user);
    } catch (err) {
      throw new HttpException(err.code, err.status || 400, {
        cause: err.validation || err.message,
      });
    }
  }
}
