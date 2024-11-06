import { Permissions } from '@app/contracts/common/permissions';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IUser = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ type: String, required: true, minlength: 5, maxlength: 50 })
  name: string;

  @Prop({
    type: String,
    required: true,
    maxlength: 255,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024, //after hashing the pass, it takes up to 1024
    select: false,
  })
  password: string;

  @Prop({
    type: [String],
    required: false,
    default: [],
  })
  permissions: Permissions[];

  @Prop({
    type: Boolean,
    default: false,
  })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
