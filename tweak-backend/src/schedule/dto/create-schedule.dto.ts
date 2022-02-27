import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  todo: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsString()
  colorCode: string;
  finished: boolean;
  username: string;
}
