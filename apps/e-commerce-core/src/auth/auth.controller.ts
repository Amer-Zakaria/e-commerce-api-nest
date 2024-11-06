import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserAuthDto,
  userCredSchema,
} from '@app/contracts/users-client/auth/user.auth.dto';
import { Response } from 'express';
import { ZodValidationPipe } from '../common/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(userCredSchema)) userAuthDto: UserAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.auth(userAuthDto);
    res.header('x-auth-token', token);
  }
}
