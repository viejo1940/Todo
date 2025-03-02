'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, CreateTaskData, taskService } from '@/services/task.service';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface TaskDialogProps {
  task?: Task;
  selectedDate?: Date;
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
}

export function TaskDialog({ task, selectedDate, onTaskCreated, onTaskUpdated }: TaskDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: task?.title || '',
    description: task?.description || '',
    startDate: task?.startDate || format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm"),
    endDate: task?.endDate || format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task) {
        const updatedTask = await taskService.updateTask(task._id, formData);
        onTaskUpdated?.(updatedTask);
        toast({
          title: 'Task updated',
          description: 'Your task has been updated successfully.',
        });
      } else {
        const newTask = await taskService.createTask(formData);
        onTaskCreated?.(newTask);
        toast({
          title: 'Task created',
          description: 'Your task has been created successfully.',
        });
      }
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={task ? 'outline' : 'default'}>
          {task ? 'Edit Task' : 'New Task'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          {task && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={task.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 