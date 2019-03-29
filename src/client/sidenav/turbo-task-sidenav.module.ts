import { NgModule } from '@angular/core';

import { SidenavComponent } from './sidenav.component';
import { MaterialComponentModule } from '../material-component.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ListViewComponent } from '../list/list-view/list-view.component';
import { ListModule } from '../list/list.module';

@NgModule({
    imports: [ 
        SharedModule, 
        MaterialComponentModule,
        RouterModule,
        ListModule
    ],
    declarations: [ SidenavComponent ],
    exports: [ SidenavComponent ]
})
export class TurboTaskSidenavModule {}
