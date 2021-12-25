import mongoose from ".";
import { generateHash } from "../secrets";

const User = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.String,
    minlength: 5,
    required: true,
    unique: true
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

User.methods.validatePassword = function (password: string): boolean {
  // validate using crypto
  const hash: string = generateHash(password);
  return this.password === hash;
};

export const UserSchema = mongoose.model("User", User);
