import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar.component';
import { MaterialComponentModule } from '../material-component.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [ 
        SharedModule,
        MaterialComponentModule 
    ],
    declarations: [ ToolbarComponent ],
    exports: [ ToolbarComponent ]
})
export class ToolbarModule {}
