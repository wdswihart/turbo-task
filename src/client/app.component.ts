import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { NavService } from './shared/nav.service';

@Component({
  selector: 'turbo-task-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  title = 'Turbo Task';

  constructor(private navService: NavService, 
      private authService: AuthService) {}

  private onSidebarUsernameClick() {
    this.navService
        .navigateByUrl('user/' + this.authService.getUserDetails().username);
  }

  private navigateTo(url: string) {
    this.navService.navigateByUrl(url);
  }

  private navigateToUserPage() {
    this.navigateTo(`user/${this.authService.getUserDetails().username}`);
  }

  private logOut() {
    this.authService.logOut();
    this.navigateTo('/');
  }
}
