import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TokenPayload } from '../shared/interfaces/token-payload.interface';
import { AuthService } from '../shared/auth.service';
import { TaskService } from '../task/task.service';
import { NavService } from '../shared/nav.service';

@Component({
    selector: 'turbo-task-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
    private credentials: TokenPayload = {
        username: '',
        password: ''
    };

    constructor(private authService: AuthService, 
            private navService: NavService,
            private taskService: TaskService) {}

    register() {
         if (this.credentials.username.length > 0 && 
                this.credentials.password.length > 0) {
            this.authService.register(this.credentials).subscribe(() => {
                if (this.authService.redirectUrl) {
                    this.navService.navigateByUrl(this.authService.redirectUrl);
                    this.authService.redirectUrl = '';
                } else {
                    this.navService.navigateByUrl('/');
                }
            }, err => {
                console.error(err);
            });
        }
    }

    logIn() {
        if (this.credentials.username.length > 0 &&
                this.credentials.password.length > 0) {
            this.authService.logIn(this.credentials).subscribe(() => {
                if (this.authService.redirectUrl) {
                    this.navService.navigateByUrl(this.authService.redirectUrl);
                    this.authService.redirectUrl = '';
                } else {
                    this.navService.navigateByUrl('/');
                }
            }, err => {
                console.error(err);
            });
        }
    }
}
