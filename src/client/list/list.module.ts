import { NgModule } from "@angular/core";
import { ListViewComponent } from "./list-view/list-view.component";
import { MaterialComponentModule } from "../material-component.module";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../shared/shared.module";
import { ListCreatorComponent } from "./list-creator/list-creator.component";

@NgModule({
    imports: [ 
        MaterialComponentModule,
        HttpClientModule,
        SharedModule
     ],
    declarations: [ 
        ListViewComponent,
        ListCreatorComponent
    ],
    exports: [  
        ListViewComponent,
        ListCreatorComponent
    ]
})
export class ListModule {}
