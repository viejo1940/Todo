'use client';

import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Task } from '@/services/task.service';

interface CalendarProps {
  tasks: Task[];
}

export default function Calendar({ tasks }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      const taskStartDate = new Date(task.startDate);
      const taskEndDate = new Date(task.endDate);
      return (
        isSameDay(date, taskStartDate) ||
        isSameDay(date, taskEndDate) ||
        (date > taskStartDate && date < taskEndDate)
      );
    });
  };

  const getTaskColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-red-500';
      case 'pending':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((date, index) => {
          const dayTasks = getTasksForDay(date);
          const isCurrentMonth = isSameMonth(date, currentDate);

          return (
            <div
              key={date.toString()}
              className={cn(
                'min-h-[120px] p-2 border border-gray-200',
                !isCurrentMonth && 'bg-gray-50',
                'relative'
              )}
            >
              <span
                className={cn(
                  'text-sm',
                  !isCurrentMonth && 'text-gray-400'
                )}
              >
                {format(date, 'd')}
              </span>
              <div className="mt-1 space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task._id}
                    className={cn(
                      'text-xs p-1 rounded truncate text-white',
                      getTaskColor(task.status)
                    )}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 