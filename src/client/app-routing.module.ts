import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TaskViewComponent } from './task/task-view/task-view.component';
import { TaskCreatorComponent } from './task/task-creator/task-creator.component';
import { ListCreatorComponent } from './list/list-creator/list-creator.component';

const appRoutes: Routes = [ 
    { path: 'login', component: LoginComponent },
    { path: 'task_view', component: TaskViewComponent },
    { path: 'task_creator', component: TaskCreatorComponent },
    { path: 'list_creator', component: ListCreatorComponent },
    { path: '', redirectTo: 'task_view', pathMatch: 'full' }
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
