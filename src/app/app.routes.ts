import { Routes } from '@angular/router';
import { ListTaskComponent } from './pages/list-task/list-task.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "tasks",
        pathMatch: "full"
    },
    {
        path: "tasks",
        component: ListTaskComponent
    },
    {
        path: "tasks/create",
        component: CreateTaskComponent
    },
    {
        path: "tasks/edit/:id",
        component: EditTaskComponent
    }
];
