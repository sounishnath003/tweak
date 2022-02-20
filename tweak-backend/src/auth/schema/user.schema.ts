import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ collection: 'users' })
export class User {
  @Prop({
    type: SchemaTypes.String,
    required: true,
    index: 'hashed',
    unique: true,
    lowercase: true,
  })
  username: string;

  @Prop({ type: SchemaTypes.String, required: true })
  password: string;

  @Prop({ type: SchemaTypes.Date, default: () => Date.now() })
  createdAt: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
