import { Metadata } from 'next';
import { TaskStats } from '@/components/dashboard/TaskStats';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Task management dashboard with statistics and recent tasks.',
};

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <TaskStats />
      </div>
    </div>
  );
} 