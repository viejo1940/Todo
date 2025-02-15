import api, { endpoints, handleApiError } from '@/lib/axios';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'overdue';
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed' | 'overdue';
  dueDate?: string;
}

class TaskService {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>(endpoints.tasks.list);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await api.post<Task>(endpoints.tasks.create, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    try {
      const response = await api.patch<Task>(endpoints.tasks.update(id), data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(endpoints.tasks.delete(id));
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
      const response = await api.get<{
        pending: number;
        completed: number;
        overdue: number;
        upcoming: number;
      }>('/tasks/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const taskService = new TaskService(); 