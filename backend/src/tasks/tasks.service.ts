import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.endDate < createTaskDto.startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const task = new this.taskModel({
      ...createTaskDto,
      userId: new Types.ObjectId(userId),
    });
    return task.save();
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (updateTaskDto.startDate && updateTaskDto.endDate) {
      if (updateTaskDto.endDate < updateTaskDto.startDate) {
        throw new BadRequestException('End date cannot be before start date');
      }
    }

    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(taskId),
        userId: new Types.ObjectId(userId),
      },
      { $set: updateTaskDto },
      { new: true },
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(userId: string, taskId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Task[]> {
    return this.taskModel
      .find({
        userId: new Types.ObjectId(userId),
        startDate: { $gte: startDate },
        endDate: { $lte: endDate },
      })
      .sort({ startDate: 1 })
      .exec();
  }

  async findByStatus(userId: string, status: string): Promise<Task[]> {
    return this.taskModel
      .find({
        userId: new Types.ObjectId(userId),
        status,
      })
      .sort({ startDate: 1 })
      .exec();
  }

  async getTaskStatistics(userId: string) {
    try {
      const userObjectId = new Types.ObjectId(userId);
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const [
        totalTasks,
        upcomingTasks,
        completedTasks,
        startedTasks,
        overdueTasks
      ] = await Promise.all([
        // Total tasks
        this.taskModel.countDocuments({ userId: userObjectId }),
        
        // Upcoming tasks (due within next 7 days and not completed)
        this.taskModel.countDocuments({
          userId: userObjectId,
          status: TaskStatus.UPCOMING,
          endDate: { $gte: now, $lte: oneWeekFromNow }
        }),
        
        // Completed tasks
        this.taskModel.countDocuments({
          userId: userObjectId,
          status: TaskStatus.COMPLETED
        }),
        
        // Started tasks
        this.taskModel.countDocuments({
          userId: userObjectId,
          status: TaskStatus.STARTED
        }),
        
        // Overdue tasks (past due date and not completed)
        this.taskModel.countDocuments({
          userId: userObjectId,
          status: { $ne: TaskStatus.COMPLETED },
          endDate: { $lt: now }
        })
      ]);

      return {
        total: totalTasks,
        upcoming: upcomingTasks,
        completed: completedTasks,
        started: startedTasks,
        overdue: overdueTasks,
        completion_rate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      };
    } catch (error) {
      if (error.name === 'BSONError' || error.name === 'CastError') {
        throw new BadRequestException('Invalid user ID format');
      }
      throw error;
    }
  }
} 