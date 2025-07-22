import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Constants, TaskManager } from '../../models/TaskManager';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CommonModule, formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-task',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit {
  taskForm: any;

  isSubmitted: boolean = false;

  selectedDate: string = "";

  task: TaskManager = {
    id: 0,
    title: "",
    status: "",
    priority: "",
    dueDate: new Date()
  }

  taskId: number = 0;

  dateValue: Date = new Date();

  masterSrv = inject(TaskService);


  selectedStatusValue: string = "Open";
  
  statusList?: any[];

  priorityList?: any[]

  errorMessage: string = "";


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private routerActive: ActivatedRoute
  ){
    this.statusList = Constants.statusList;
    this.priorityList = Constants.priorityList;


  }

  getTaskManagerById(id: number){
    this.masterSrv.getTaskManagerById(this.taskId).subscribe(
      (data) =>{

        // var dueDate = data.dueDate;
        // const formatDate = dueDate.getDate() < 10 ? `0${dueDate.getDate()}`:dueDate.getDate();
        // const formatMonth = dueDate.getMonth() < 10 ? `0${dueDate.getMonth()}`: dueDate.getMonth();
        // const formattedDate = [dueDate.getFullYear(), formatMonth, formatDate].join('-');
        
        this.selectedDate = formatDate(data.dueDate, 'yyyy-MM-dd', "en-US");

        this.dateValue = data.dueDate;



        
        this.task.title = data.title;
        this.task.status = data.status;
        this.task.priority = data.priority;
        this.task.dueDate = data.dueDate;
        this.task.id = id;

        this.selectedStatusValue = data.status;
        this.taskForm.controls["title"].setValue(data.title);
        this.taskForm.controls["status"].setValue(data.status);
        this.taskForm.controls["priority"].setValue(data.priority);
        
    },
    error => {console.log(error)});
  }

  ngOnInit(): void {
    this.isSubmitted = false;
    this.taskForm = this.formBuilder.group({
      title: ["", Validators.required],
      status: ["", Validators.required],
      priority: ["", Validators.required],
      dueDate: [formatDate(new Date(), 'yyyy-MM-dd', "en-US"), [Validators.required]],
   });
    this.taskId = +(this.routerActive.snapshot.params["id"]||0);
    this.getTaskManagerById(this.taskId);
  }

  displayErrorOnForm( controlName: string): boolean{
    const control = this.taskForm.get(controlName);
    control.autofocus;
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
  }

  Save(){
    if (this.taskForm.valid){
        this.task.title = this.taskForm.get("title")?.value;
        this.task.status = this.taskForm.get("status")?.value;
        this.task.priority = this.taskForm.get("priority")?.value;
        this.task.dueDate = this.taskForm.get("dueDate")?.value;

        this.masterSrv.updateTaskManager(this.task).subscribe(
          (value) =>{
            this.router.navigate(["tasks"]);
          },
          err =>{
            var dueDateError = err.error.errors.dueDate[0];
            if (dueDateError){
              //Due Date must be in the future 
              this.errorMessage = ` Due Date ${dueDateError}`;
            }
            console.log("Save Error: ", err.error.errors);
          }
        )
    }
  }

  Cancel(){
    this.router.navigate(["tasks"]);
  }
}
