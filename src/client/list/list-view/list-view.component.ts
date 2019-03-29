import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ListDetails } from 'src/client/shared/interfaces/list-details.interface';
import { ListService } from '../list.service';
import { AuthService } from 'src/client/shared/auth.service';
import { Router } from '@angular/router';
import { NavService } from 'src/client/shared/nav.service';

@Component({
    selector: 'turbo-task-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: [ './list-view.component.scss' ]
})
export class ListViewComponent implements OnInit {
    private lists: ListDetails[];
    @Output() sidebarClose = new EventEmitter<boolean>();
    private isUserLoggedIn = false;

    constructor(private listService: ListService, 
            private authService: AuthService,
            private navService: NavService) {}

    ngOnInit() {
        this.listService.lists$.subscribe(lists => this.lists = lists);
        this.authService.isLoggedIn$.subscribe(isLoggedIn =>
                this.isUserLoggedIn = isLoggedIn);
    }

    private navigateTo(url: string) {
        this.sidebarClose.emit(true);
        this.navService.navigateByUrl(url);
    }

    private selectList(name: string) {
        this.listService.setActiveList(null, name);
        this.navigateTo('task_view');
    }
}
