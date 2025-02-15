export enum TaskStatus {
  UPCOMING = 'upcoming',
  STARTED = 'started',
  COMPLETED = 'completed',
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: TaskStatus;
} 