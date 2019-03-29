import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './login.component';

const loginRoutes: Routes = [
    {
        path: 'login',
        canActivate: [ LoginGuard ],
        component: LoginComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(loginRoutes) ],
    exports: [ RouterModule ]
})
export class LoginRoutingModule {}
