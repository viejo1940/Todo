'use client';

import { useState } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function DashboardContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
      
      <TaskList />

      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          // Force a revalidation of the tasks list
          window.location.reload();
        }}
      />
    </div>
  );
} 