import { NgModule } from '@angular/core';
import { TaskViewComponent } from './task-view/task-view.component';
import { TaskCreatorComponent } from './task-creator/task-creator.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialComponentModule } from '../material-component.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [ 
        SharedModule, 
        MaterialComponentModule,
    ],
    declarations: [ TaskViewComponent, TaskCreatorComponent ],
    exports: [ TaskViewComponent, TaskCreatorComponent ]
})
export class TaskModule {}
