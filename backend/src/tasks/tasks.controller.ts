import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ParseDatePipe } from '../utils/pipes/parse-date.pipe';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('stats')
  getTaskStatistics(@GetUser('_id') userId: string) {
    return this.tasksService.getTaskStatistics(userId);
  }

  @Post()
  create(@GetUser('_id') userId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(userId, createTaskDto);
  }

  @Get()
  findAll(@GetUser('_id') userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Get('date-range')
  findByDateRange(
    @GetUser('_id') userId: string,
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.tasksService.findByDateRange(userId, startDate, endDate);
  }

  @Get('status/:status')
  findByStatus(
    @GetUser('_id') userId: string,
    @Param('status') status: string,
  ) {
    return this.tasksService.findByStatus(userId, status);
  }

  @Get(':id')
  findOne(@GetUser('_id') userId: string, @Param('id') taskId: string) {
    return this.tasksService.findOne(userId, taskId);
  }

  @Patch(':id')
  update(
    @GetUser('_id') userId: string,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, taskId, updateTaskDto);
  }

  @Delete(':id')
  remove(@GetUser('_id') userId: string, @Param('id') taskId: string) {
    return this.tasksService.remove(userId, taskId);
  }
} 