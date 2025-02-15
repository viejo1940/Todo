'use client';

import { useEffect, useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

export function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enable immediate revalidation
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/signin');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await response.json();
      
      // Validate the response data
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setTasks(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/dashboard/tasks/${taskId}`);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-500';
      case TaskStatus.STARTED:
        return 'bg-blue-500';
      case TaskStatus.UPCOMING:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
          <p>No tasks found. Create your first task to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card 
          key={task._id} 
          className="w-full hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleTaskClick(task._id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
              <Badge className={`${getStatusColor(task.status)} text-white`}>
                {task.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {task.description && (
              <p className="text-muted-foreground mb-2">{task.description}</p>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Start: </span>
                {format(new Date(task.startDate), 'PPP')}
              </div>
              <div>
                <span className="font-medium">Due: </span>
                {format(new Date(task.endDate), 'PPP')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 