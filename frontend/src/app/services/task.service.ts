import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskResponse, TaskListResponse } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  /** Get all tasks with optional filters */
  getTasks(status?: string, priority?: string): Observable<TaskListResponse> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (status) params.push(`status=${status}`);
    if (priority) params.push(`priority=${priority}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<TaskListResponse>(url);
  }

  /** Get a single task by ID */
  getTask(id: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`);
  }

  /** Create a new task */
  createTask(task: Partial<Task>): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, task);
  }

  /** Update an existing task */
  updateTask(id: string, task: Partial<Task>): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, task);
  }

  /** Delete a task */
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
