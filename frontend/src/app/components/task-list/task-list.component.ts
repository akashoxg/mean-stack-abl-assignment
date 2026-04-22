import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal('');
  showForm = signal(false);
  editingTask = signal<Task | null>(null);
  filterStatus = signal('');

  // Form fields
  formTitle = '';
  formDescription = '';
  formStatus: 'pending' | 'in-progress' | 'completed' = 'pending';
  formPriority: 'low' | 'medium' | 'high' = 'medium';
  formDueDate = '';

  // Stats
  stats = computed(() => {
    const all = this.tasks();
    return {
      total: all.length,
      pending: all.filter(t => t.status === 'pending').length,
      inProgress: all.filter(t => t.status === 'in-progress').length,
      completed: all.filter(t => t.status === 'completed').length
    };
  });

  filteredTasks = computed(() => {
    const filter = this.filterStatus();
    if (!filter) return this.tasks();
    return this.tasks().filter(t => t.status === filter);
  });

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set('');
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks.set(res.tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to connect to the server. Make sure the backend is running on port 3000.');
        this.loading.set(false);
        console.error('Load tasks error:', err);
      }
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  openEditForm(task: Task): void {
    this.formTitle = task.title;
    this.formDescription = task.description;
    this.formStatus = task.status;
    this.formPriority = task.priority;
    this.formDueDate = task.dueDate ? task.dueDate.substring(0, 10) : '';
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTask.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.formTitle = '';
    this.formDescription = '';
    this.formStatus = 'pending';
    this.formPriority = 'medium';
    this.formDueDate = '';
  }

  submitForm(): void {
    if (!this.formTitle.trim()) return;

    const taskData: Partial<Task> = {
      title: this.formTitle.trim(),
      description: this.formDescription.trim(),
      status: this.formStatus,
      priority: this.formPriority,
      dueDate: this.formDueDate || null
    };

    const editing = this.editingTask();
    if (editing && editing._id) {
      this.taskService.updateTask(editing._id, taskData).subscribe({
        next: () => {
          this.closeForm();
          this.loadTasks();
        },
        error: (err) => console.error('Update error:', err)
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.closeForm();
          this.loadTasks();
        },
        error: (err) => console.error('Create error:', err)
      });
    }
  }

  deleteTask(task: Task): void {
    if (!task._id) return;
    if (!confirm(`Delete "${task.title}"?`)) return;

    this.taskService.deleteTask(task._id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Delete error:', err)
    });
  }

  toggleStatus(task: Task): void {
    if (!task._id) return;
    const nextStatus: Record<string, string> = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending'
    };
    const newStatus = nextStatus[task.status] as Task['status'];
    this.taskService.updateTask(task._id, { status: newStatus }).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Toggle error:', err)
    });
  }

  setFilter(status: string): void {
    this.filterStatus.set(this.filterStatus() === status ? '' : status);
  }

  getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    };
    return icons[priority] || '⚪';
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'pending': '⏳',
      'in-progress': '🔄',
      'completed': '✅'
    };
    return icons[status] || '⚪';
  }

  getTimeAgo(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
