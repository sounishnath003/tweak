import { IsAlphanumeric, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsAlphanumeric()
  password: string;
}
