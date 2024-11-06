import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientConfigModule } from '../client-config/client-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { CheckUniquenessService } from '../common/check-uniqueness.service';
import { CheckExistenceService } from '../common/check-existence.service';

@Module({
  imports: [
    ClientConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    AuthService,
    CheckUniquenessService,
    CheckExistenceService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
