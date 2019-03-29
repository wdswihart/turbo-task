import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListCreatorComponent } from "./list-creator.component";
import { ListCreatorGuard } from "./list-creator.guard";

const listCreatorRoutes: Routes = [
    {
        path: 'list_creator',
        canActivate: [ ListCreatorGuard ],
        component: ListCreatorComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(listCreatorRoutes) ],
    exports: [ RouterModule ]
})
export class ListCreatorRoutingModule {}
