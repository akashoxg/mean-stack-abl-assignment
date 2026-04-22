/**
 * Task interface — defines the shape of a task object from the API.
 */
export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskResponse {
  success: boolean;
  task: Task;
}

export interface TaskListResponse {
  success: boolean;
  count: number;
  tasks: Task[];
}
