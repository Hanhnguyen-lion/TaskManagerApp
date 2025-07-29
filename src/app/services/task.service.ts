import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskManager, TaskParameters } from '../models/TaskManager';
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

  getTaskManagers(parameters: TaskParameters): Observable<any>{
    const url = `${this.api_url}/${this.controllerName}/GetAll/${parameters.PageNumber}/${parameters.PageSize}` ;
    

    return this.http.get<any>(url);
  }

  getTaskManagerById(id: number): Observable<TaskManager>{
    const url = `${this.api_url}/${this.controllerName}/GetById/${id}` ;
    return this.http.get<TaskManager>(url);
  }

  searchTaskManagers(status: string, title: string, parameters: TaskParameters):  Observable<any>{
    const url = `${this.api_url}/${this.controllerName}/Search` ;
    
    let params = new HttpParams()
          .set('status', status)
          .set('title', title)
          .set('pageNumber', parameters.PageNumber)
          .set('pageSize', parameters.PageSize);

    return this.http.get<any>(url, { params});
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
