import { Metadata } from 'next';
import { TasksTable } from '@/components/tasks/TasksTable';

export const metadata: Metadata = {
  title: 'Tasks - Todo App',
  description: 'Manage your tasks',
};

export default function TasksPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks Management</h1>
      </div>
      
      <TasksTable />
    </div>
  );
} 