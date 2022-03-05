import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/schema/user.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
@UseGuards(AuthGuard())
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto, @GetUser() user: User) {
    return this.scheduleService.create({
      ...createScheduleDto,
      username: user.username,
    });
  }

  @Get('find-all')
  async findAll(@GetUser() user: User) {
    return await this.scheduleService.findAll(user);
  }

  @Get('find-by-week')
  async findByCurrentWeek(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @GetUser() user: User,
  ) {
    return await this.scheduleService.findByWeek(user, from, to);
  }

  @Get()
  async findOne(@Query('id') id: string) {
    return await this.scheduleService.findOne(id);
  }

  @Patch('update')
  update(
    @Query('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Patch('update-date')
  updateDateById(@Query('id') id: string, @Body() payload: { newDate: Date }) {
    return this.scheduleService.updateDateById(id, payload.newDate);
  }

  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
