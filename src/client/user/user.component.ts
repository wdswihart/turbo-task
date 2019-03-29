import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
    selector: 'turbo-task-user',
    templateUrl: './user.component.html',
    styleUrls: [ './user.component.scss' ]
})
export class UserComponent {
    private newPassword: string;
    private confirmPassword: string;

    constructor(private route: ActivatedRoute, 
            private authService: AuthService) {}

    onChangePasswordClick() {
        if (this.newPassword.length > 0 && 
                this.newPassword === this.confirmPassword) {
            this.authService.changePassword(this.newPassword);
            this.newPassword = '';
            this.confirmPassword = '';
        }
    }
}
