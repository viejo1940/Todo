import { clientApi, apiEndpoints, handleApiError } from '@/lib/axios';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'overdue';
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: 'pending' | 'completed' | 'overdue';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed' | 'overdue';
  startDate?: string;
  endDate?: string;
}

class TaskService {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await clientApi.get<Task[]>(apiEndpoints.tasks.list);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await clientApi.post<Task>(apiEndpoints.tasks.create, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    try {
      const response = await clientApi.patch<Task>(apiEndpoints.tasks.update(id), data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await clientApi.delete(apiEndpoints.tasks.delete(id));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTaskStats(): Promise<{
    pending: number;
    completed: number;
    overdue: number;
    upcoming: number;
  }> {
    try {
      const response = await clientApi.get<{
        pending: number;
        completed: number;
        overdue: number;
        upcoming: number;
      }>(apiEndpoints.tasks.stats);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const taskService = new TaskService(); 