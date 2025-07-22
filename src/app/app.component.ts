import { Component } from '@angular/core';
import { Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Constants, TaskManager } from './models/TaskManager';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Task Manager';

  statusList?: any[];

  constructor(
    private router: Router
  ){
    this.statusList = Constants.statusList;

  }

  onSearch(title: string, status: string){

      this.router.navigate(['tasks'],
      { queryParams: { status: status, title: title} });

  }
  
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }  
}
