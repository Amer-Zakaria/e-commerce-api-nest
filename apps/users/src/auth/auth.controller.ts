import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  UserAuthDto,
  userCredSchema,
} from '@app/contracts/users-client/auth/user.auth.dto';
import { AUTH_PATTERNS } from '@app/contracts/users-client/auth/auth.pattern';
import { ZodValidationPipe } from '../common/validation.pipe';
import ExtractedPayloadDec from '../common/extract-payload.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.USER_AUTH)
  create(
    @ExtractedPayloadDec(new ZodValidationPipe(userCredSchema))
    userAuthDto: UserAuthDto,
  ) {
    return this.authService.auth(userAuthDto);
  }
}
