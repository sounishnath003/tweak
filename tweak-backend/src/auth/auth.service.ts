import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  comparePasswords,
  generateHashPassword,
} from 'src/shared/utils/bcrypt.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signupWithUsernamePassword(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    try {
      const { username, password } = createUserDto;
      const isExists = await this.userModel.findOne({
        username: createUserDto.username,
      });
      if (isExists) throw new ConflictException(`Username already exists!`);
      const { data, error } = await generateHashPassword(
        createUserDto.password,
      );
      if (error) throw error;

      const user = new this.userModel({ username, password: data });
      await user.save();
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error: any) {
      return error;
    }
  }

  async loginWithUsernamePassword(
    filterUserParams: FilterQuery<UserDto>,
  ): Promise<{ accessToken: string }> {
    try {
      const { username, password } = filterUserParams;
      const isExists = await this.userModel.findOne({
        username: username,
      });
      if (!isExists)
        throw new NotFoundException(`${username} does not exists!`);
      const { data, error } = await comparePasswords(
        isExists.password,
        password,
      );
      if (error) throw error;

      if (!data)
        throw new UnauthorizedException(`Username / password does not matched`);

      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error) {
      return error;
    }
  }
}
