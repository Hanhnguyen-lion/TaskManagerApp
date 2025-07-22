import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskManager } from '../models/TaskManager';
import apiUrl from "../config/config.json";

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  api_url = apiUrl.ApiServer.url;

  controllerName: string = "TaskManagers";

  httpHeader = {headers: new HttpHeaders({
    "Content-Type": "application/json"
  })};

  constructor(
    private http: HttpClient
  ) { }

  getTaskManagers(): Observable<TaskManager[]>{
    const url = `${this.api_url}/${this.controllerName}/GetAll` ;
    
    return this.http.get<TaskManager[]>(url);
  }

  getTaskManagerById(id: number): Observable<TaskManager>{
    const url = `${this.api_url}/${this.controllerName}/GetById/${id}` ;
    return this.http.get<TaskManager>(url);
  }

  searchTaskManagers(status: string):  Observable<TaskManager[]>{
    const url = `${this.api_url}/${this.controllerName}/Search/?status=${status}` ;
    return this.http.get<TaskManager[]>(url);
  }

  createTaskManager(item: TaskManager): Observable<TaskManager>{
    const url = `${this.api_url}/${this.controllerName}/Add` ;
    return this.http.post<TaskManager>(url, item, this.httpHeader);
  }

  updateTaskManager(item: TaskManager): Observable<TaskManager>{
    const url = `${this.api_url}/${this.controllerName}/Update/${item.id}` ;
    return this.http.put<TaskManager>(url, item, this.httpHeader);
  }

  deleteTaskManager(id: number): Observable<void>{
    const url = `${this.api_url}/${this.controllerName}/Delete/${id}` ;
    return this.http.delete<void>(url);
  }
}
