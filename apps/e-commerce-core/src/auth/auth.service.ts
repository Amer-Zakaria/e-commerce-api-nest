import { BadRequestException, Injectable } from '@nestjs/common';
import { UserAuthDto } from '@app/contracts/users-client/auth/user.auth.dto';
import { IUser, User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ERROR_TYPE } from '@app/contracts/error/error-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    readonly configService: ConfigService,
  ) {}

  async auth(userAuthDto: UserAuthDto) {
    const user = (await this.userModel
      .findOne({ email: userAuthDto.email })
      .lean()
      .select('+password')) as IUser & { password: string };

    if (!user)
      throw new BadRequestException(ERROR_TYPE.CUSTOM_VALIDATION, {
        cause: 'Incorrect Email or Password!',
      });

    const { password, ...userWithoutPass } = user;

    // Is it the right password
    const isValidePassword = await bcrypt.compare(
      userAuthDto.password || '',
      password,
    );
    if (!isValidePassword)
      throw new BadRequestException(ERROR_TYPE.CUSTOM_VALIDATION, {
        cause: 'Incorrect Email or Password!',
      });

    const token = this.generateAuthToken(userWithoutPass);
    return token;
  }

  generateAuthToken(userWithoutPass: Partial<IUser>) {
    const token = jwt.sign(
      userWithoutPass,
      this.configService.get<string>('jwtPrivateKey', ''), // jwt.sign throws an error if private key is empty
    );
    return token;
  }
}
