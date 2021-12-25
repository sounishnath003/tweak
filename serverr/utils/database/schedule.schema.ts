import mongoose from ".";
import { UserSchema } from "./user.schema";

const Schedule = new mongoose.Schema({
  todo: {
    type: mongoose.SchemaTypes.String,
    required: true,
    minlength: 2,
    trim: true,
  },
  date: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date().toDateString(),
  },
  colorCode: {
    type: mongoose.SchemaTypes.Number,
    default: 1,
  },
  finished: {
    type: mongoose.SchemaTypes.Boolean,
    default: false,
  },
  username: {
    type: mongoose.SchemaTypes.String,
    ref: UserSchema,
    required: true,
  },
});

export const ScheduleSchema = mongoose.model("schedules", Schedule);
