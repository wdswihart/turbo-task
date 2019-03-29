import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from './user.guard';
import { UserComponent } from './user.component';
import { TaskViewComponent } from '../task/task-view/task-view.component';

const userRoutes: Routes = [
    {
        path: 'user/:user',
        component: UserComponent,
        canActivate: [ UserGuard ],
        children: [
            {
                path: '',
                children: [
                    { path: ':list', component: TaskViewComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(userRoutes) ],
    exports: [ RouterModule ]
})
export class UserRoutingModule {}
