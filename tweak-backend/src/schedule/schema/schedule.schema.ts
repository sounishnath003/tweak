import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

@Schema({ collection: 'schedules' })
export class Schedule {
  @Prop({
    type: SchemaTypes.String,
    minlength: 2,
    required: true,
  })
  todo: string;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
  })
  date: string;

  @Prop({
    type: SchemaTypes.Number,
    default: 2,
  })
  colorCode: number;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
  })
  finished: boolean;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    ref: 'users',
  })
  username: string;

  @Prop({
    type: SchemaTypes.Date,
    required: true,
    default: () => Date.now(),
  })
  createdAt: Date;
}

export type ScheduleDocument = User & Document;

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
