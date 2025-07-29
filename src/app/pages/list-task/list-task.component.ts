import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { TaskManager, TaskParameters } from '../../models/TaskManager';
import { Observable } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-task',
  imports: [DatePipe, CommonModule, ReactiveFormsModule, RouterOutlet, MatPaginatorModule],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.css'
})

export class ListTaskComponent implements OnInit {

  taskList?: TaskManager[];
  taskParameter : TaskParameters = {
    PageSize : 5,
    PageNumber : 0
  };

  masterSrv = inject(TaskService);

  booleanValue: boolean = false;
  sortDirection: string = "asc";
  
  p: number = 1;

  items = [];
  pageOfItems: Array<any> = new Array<any>();

  pageIndex: number = 0;

  totalItems: number = 0;
  pageSize: number = 5; 
  pageSizeOptions: number[] = [5, 10, 25, 100];



  pageEvent: PageEvent | undefined;
 
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;  
  
  status: string = "";
  title: string = "";
  
  constructor(
    private router: Router,
    private activeTouter: ActivatedRoute,
    private dialogSrv: DialogService
  ){
  }

  ngOnInit(): void {
    this.activeTouter.queryParams.subscribe((param) =>{
  
      this.pageIndex = 0;
  
      this.status = param["status"];
      this.title = param["title"];

      this.taskParameter.PageNumber = this.pageIndex;

      this.getTaskList();
    })
  }



  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalItems = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.taskParameter = {
      PageNumber: this.pageIndex + 1,
      PageSize: this.pageSize
    };
    
    this.getTaskList();
  }
  
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  setFilteredData() {
    this.taskList = this.taskList?.slice(this.pageSize * this.pageIndex, this.pageSize * this.pageIndex + this.pageSize);
  }

  getTaskList(){

    if (this.status || this.title){
      var items = this.masterSrv.searchTaskManagers(this.status, this.title, this.taskParameter);
      items.subscribe(
        (data) =>{
          this.taskList = data?.data;
          this.totalItems = data.totalRecords;
        }
      )
    }
    else{
      var items: Observable<any> = this.masterSrv.getTaskManagers(this.taskParameter);
      items.subscribe(
        (data) =>{
          this.taskList = data?.data;
          this.totalItems = data.totalRecords;
        }
      )
   }

  }

  sortTitle(columnName: string, booleanValue: boolean) {
    if (columnName == "Title"){
      if (booleanValue){
        this.taskList?.sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0)
        this.booleanValue = !this.booleanValue;
        this.sortDirection = "desc";
      }
      else{
        this.taskList?.sort((a, b) => a.title < b.title ? 1 : a.title > b.title ? -1 : 0)
        this.booleanValue = !this.booleanValue;
        this.sortDirection = "asc";
      }
    }
    else if (columnName == "Due Date"){
      if (booleanValue){
        this.taskList?.sort((a, b) => a.dueDate > b.dueDate ? 1 : a.dueDate < b.dueDate ? -1 : 0)
        this.booleanValue = !this.booleanValue;
        this.sortDirection = "desc";
      }
      else{
        this.taskList?.sort((a, b) => a.dueDate < b.dueDate ? 1 : a.dueDate > b.dueDate ? -1 : 0)
        this.booleanValue = !this.booleanValue;
        this.sortDirection = "asc";
      }
    }
  } 

  onEdit(id: number){
    var url = `tasks/edit/${id}`;
    this.router.navigate([url])
  }

  onDelete(id: number){
    this.dialogSrv.openConfirmDialog("Are you sure to want delete this item?", "Delete Task")
    .subscribe((result) =>{
      if (result){
        this.masterSrv.deleteTaskManager(id).subscribe(
          () =>{
            this.pageIndex = 0;
            this.taskParameter.PageNumber = this.pageIndex + 1;
            this.getTaskList();
          },
          error => {
            console.log("Delete error: ", error);
          }
        )}
      })
  }
}
