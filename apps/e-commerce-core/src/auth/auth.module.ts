import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientConfigModule } from '../client-config/client-config.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ClientConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
