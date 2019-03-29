import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { TurboTaskSidenavService } from './sidenav.service';
import { NavService } from '../shared/nav.service';

@Component({
    selector: 'turbo-task-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: [ './sidenav.component.scss' ]
})
export class SidenavComponent implements OnInit {
    private isUserLoggedIn = false;

    constructor(private authService: AuthService, 
            private navService: NavService,
            private sidenavService: TurboTaskSidenavService) {}

    ngOnInit() {
        this.authService.isLoggedIn$.subscribe(isLoggedIn =>
                this.isUserLoggedIn = isLoggedIn);
    }

    private onUsernameClick() {
        this.navService.navigateByUrl('user/' + this.authService.getUsername());
        this.sidenavService.isSidebarOpen = false;
    }

    private onLogInButtonClick() {
        this.navService.navigateByUrl('login');
        this.sidenavService.isSidebarOpen = false;
    }

    private onLogOutButtonClick() {
        this.sidenavService.isSidebarOpen = false;
        this.authService.logOut();
    }

    private onTaskListViewEvent(event) {
        this.sidenavService.isSidebarOpen = event.value;
    }
}
