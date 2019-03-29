import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { TaskModule } from './task/task.module';
import { AuthService } from './shared/auth.service';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { TaskService } from './task/task.service';
import { ToolbarModule } from './toolbar/toolbar.module';
import { MaterialComponentModule } from './material-component.module';
import { TurboTaskSidenavModule } from './sidenav/turbo-task-sidenav.module';
import { ListModule } from './list/list.module';
import { ListService } from './list/list.service';
import { TurboTaskSidenavService } from './sidenav/sidenav.service';
import { ToolbarService } from './toolbar/toolbar.service';
import { NavService } from './shared/nav.service';
import { SnackBarService } from './shared/snack-bar.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialComponentModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    LoginModule,
    TaskModule,
    ListModule,
    TurboTaskSidenavModule,
    UserModule,
    ToolbarModule,
  ],
  providers: [ 
    AuthService, 
    TaskService,
    ListService,
    TurboTaskSidenavService,
    ToolbarService,
    NavService,
    SnackBarService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
