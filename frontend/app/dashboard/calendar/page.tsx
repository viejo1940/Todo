'use client';

import { useEffect, useState } from 'react';
import Calendar from '@/components/Calendar';
import { TaskDialog } from '@/components/TaskDialog';
import { Task, taskService } from '@/services/task.service';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CalendarPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (task: Task) => {
    setTasks([...tasks, task]);
    toast({
      title: 'Task created',
      description: 'Your task has been created successfully.',
    });
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    toast({
      title: 'Task updated',
      description: 'Your task has been updated successfully.',
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <TaskDialog
          selectedDate={selectedDate}
          onTaskCreated={handleTaskCreated}
        />
      </div>
      <Calendar
        tasks={tasks}
      />
    </div>
  );
} 