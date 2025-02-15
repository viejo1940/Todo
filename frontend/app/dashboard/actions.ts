'use server';

import { auth } from '@/auth';
import { Task, TaskStatus } from '@/types/task';
import { redirect } from 'next/navigation';

export async function getTasks() {
  const session = await auth();
  
  if (!session?.token) {
    redirect('/signin');
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/tasks`, {
    headers: {
      'Authorization': `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to fetch tasks:', error);
    throw new Error(`Failed to fetch tasks: ${error}`);
  }

  return response.json();
}

export async function getTaskStats() {
  try {
    const tasks = await getTasks();
    
    const stats = {
      pending: tasks.filter((task: Task) => task.status === TaskStatus.STARTED).length,
      completed: tasks.filter((task: Task) => task.status === TaskStatus.COMPLETED).length,
      overdue: tasks.filter((task: Task) => 
        new Date(task.endDate) < new Date() && task.status !== TaskStatus.COMPLETED
      ).length,
      upcoming: tasks.filter((task: Task) => 
        task.status === TaskStatus.UPCOMING && new Date(task.endDate) > new Date()
      ).length,
    };

    return stats;
  } catch (error) {
    console.error('Error getting task stats:', error);
    return {
      pending: 0,
      completed: 0,
      overdue: 0,
      upcoming: 0,
    };
  }
}

export async function getRecentTasks() {
  try {
    const tasks = await getTasks();
    return tasks
      .sort((a: Task, b: Task) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  } catch (error) {
    console.error('Error getting recent tasks:', error);
    return [];
  }
} 