import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Constants, dateGreaterThanTodayValidator, TaskManager } from '../../models/TaskManager';

@Component({
  selector: 'app-create-task',
  imports: [FormsModule, DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
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

  statusList?: any[];

  priorityList?: any[]

  taskId: number = 0;

  maxDate:Date = new Date();

  masterSrv = inject(TaskService);

  selectedStatusValue: string = "Open";

  errorMessage: string = "";
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ){
    this.statusList = Constants.statusList;
    this.priorityList = Constants.priorityList;
  }

  ngOnInit(): void {
    this.isSubmitted = false;
    this.taskForm = this.formBuilder.group({
      title: ["", Validators.required],
      status: ["", Validators.required],
      priority: ["", Validators.required],
      dueDate: [new Date(), [Validators.required]],
   });

  }

  displayErrorOnForm( controlName: string): boolean{
    const control = this.taskForm.get(controlName);
    control.autofocus;
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
  }

  Save(){
      this.isSubmitted = true;
    if (this.taskForm.valid){
        this.task.title = this.taskForm.get("title")?.value;
        this.task.status = this.taskForm.get("status")?.value;
        this.task.priority = this.taskForm.get("priority")?.value;
        this.task.dueDate = this.taskForm.get("dueDate")?.value;

        this.masterSrv.createTaskManager(this.task).subscribe(
          (value) =>{
            this.router.navigate(["tasks"]);
          },
          err =>{
            var dueDateError = err.error.errors.dueDate[0];
            if (dueDateError){
              //Due Date must be in the future 
              this.errorMessage = ` Due Date ${dueDateError}`;
            }
            console.log("Create Error: ", err.error.errors);
          }
        )
    }
  }


  Cancel(){
    this.router.navigate(["tasks"]);
  }
}
