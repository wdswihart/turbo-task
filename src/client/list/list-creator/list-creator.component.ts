import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { ListDetails } from "src/client/shared/interfaces/list-details.interface";
import { AuthService } from "src/client/shared/auth.service";
import { HttpClient } from "@angular/common/http";
import { Properties } from "src/client/shared/properties.enum";
import { map } from "rxjs/operators";
import { ListService } from "../list.service";
import { NavService } from "src/client/shared/nav.service";

@Component({
    selector: 'turbo-task-list-creator',
    templateUrl: './list-creator.component.html',
    styleUrls: [ './list-creator.component.scss' ]
})
export class ListCreatorComponent implements OnInit {
    private name = '';
    @ViewChild('nameField') nameField: ElementRef;

    constructor(private authService: AuthService,
            private http: HttpClient,
            private listService: ListService,
            private navService: NavService) {}

    ngOnInit() {
        this.resetFields();
    }

    private resetFields() {
        this.name = '';
        this.nameField.nativeElement.focus();
    }

    private addList() {
        if (this.name != '') {
            this.listService.addListByName(this.name);
            this.resetFields();
        }
    }
}
