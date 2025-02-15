'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';

interface TaskStats {
  total: number;
  upcoming: number;
  completed: number;
  started: number;
  overdue: number;
  completion_rate: number;
}

async function getTaskStats(): Promise<TaskStats> {
  const response = await fetch('/api/tasks/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch task statistics');
  }
  const data = await response.json();
  return data;
}

// Simple number formatter without locale
function formatNumber(num: number): string {
  return String(num || 0);
}

// Simple percentage formatter without locale
function formatPercentage(num: number): string {
  const value = num || 0;
  const rounded = Math.round(value * 10) / 10;
  return rounded.toFixed(1);
}

export function TaskStats() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTaskStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error.message || 'Error loading task statistics'}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Tasks',
      value: formatNumber(stats.total),
      icon: ClipboardList,
      className: 'text-blue-500',
    },
    {
      title: 'Upcoming Tasks',
      value: formatNumber(stats.upcoming),
      icon: Clock,
      className: 'text-yellow-500',
    },
    {
      title: 'In Progress',
      value: formatNumber(stats.started),
      icon: PlayCircle,
      className: 'text-purple-500',
    },
    {
      title: 'Completed',
      value: formatNumber(stats.completed),
      icon: CheckCircle2,
      className: 'text-green-500',
    },
    {
      title: 'Overdue',
      value: formatNumber(stats.overdue),
      icon: AlertCircle,
      className: 'text-red-500',
    },
  ];

  const completionRate = stats.completion_rate || 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.className}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPercentage(completionRate)}% of tasks completed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 