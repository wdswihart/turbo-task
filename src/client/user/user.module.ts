import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { MaterialComponentModule } from '../material-component.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [ 
        UserRoutingModule, 
        MaterialComponentModule,
        SharedModule 
    ], 
    declarations: [ UserComponent ],
    exports: [ UserComponent, UserRoutingModule ]
})
export class UserModule {}
