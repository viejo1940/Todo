import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TaskStatus {
  UPCOMING = 'upcoming',
  STARTED = 'started',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.UPCOMING,
  })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task); 