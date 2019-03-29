import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { MaterialComponentModule } from '../material-component.module';

@NgModule({
    imports: [ 
        SharedModule, 
        LoginRoutingModule,
        MaterialComponentModule
    ],
    declarations: [ LoginComponent ],
    exports: [ LoginComponent, LoginRoutingModule ]
})
export class LoginModule {}
