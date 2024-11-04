import { Controller, Post, Body, Res, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from '@app/contracts/users-client/auth/user.auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(
    @Body() userAuthDto: UserAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.create(userAuthDto).toPromise();
      res.header('x-auth-token', token);
    } catch (err) {
      throw new HttpException(err.code, err.status || 400, {
        cause: err.validation || err.message,
      });
    }
  }
}
