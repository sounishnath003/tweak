import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  todo: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsNumberString({})
  colorCode: number;
  finished: boolean;
  username: string;
}
