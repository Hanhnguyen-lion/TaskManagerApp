import { AbstractControl, ValidatorFn } from "@angular/forms";

export interface TaskManager{
    id: number,
    title: string,
    priority: string,
    status: string,
    dueDate: Date
}

export interface TaskParameters{
  PageNumber: number,
  PageSize: number
}

export const Constants = {

    statusList: [
        "Open",
        "Reopened",
        "Resolved",
        "Closed",
        "In Progress",
        "Done",
        "To Do",
        "In Review",
        "Accepted",
        "Requested",
        "Approved",
        "Cancelled"
    ],
    priorityList: [
            "Low",
            "Medium",
            "High"
    ]
}


export function dateGreaterThanTodayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0);
    if (selectedDate <= today) {
      return { 'dateNotGreaterThanToday': true };
    }
    return null;
  };
}
