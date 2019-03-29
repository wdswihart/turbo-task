import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { ListService } from '../list/list.service';
import { ListDetails } from '../shared/interfaces/list-details.interface';
import { TurboTaskSidenavService } from '../sidenav/sidenav.service';
import { TaskService } from '../task/task.service';
import { NavService } from '../shared/nav.service';

@Component({
    selector: 'turbo-task-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: [ './toolbar.component.scss' ]
})
export class ToolbarComponent implements OnInit {
    @Input() text = 'Default List';
    private isUserLoggedIn = false;
    private activeList: ListDetails;

    private viewArchivedTasksText = 'View Archived Tasks';
    private viewArchivedButtonText = this.viewArchivedTasksText;
    private removeOnSwipeText = 'Turn On Remove-On-Swipe';
    private toggleRemoveButtonText = this.removeOnSwipeText;

    constructor(private navService: NavService, 
            private authService: AuthService,
            private listService: ListService,
            private sidenavService: TurboTaskSidenavService,
            private taskService: TaskService) {}

    ngOnInit() {
        this.listService.activeList$.subscribe((activeList: ListDetails) => {
            if (activeList) {
                this.activeList = activeList;
                this.text = activeList.name;
            }
        });
        this.authService.isLoggedIn$.subscribe(isLoggedIn =>
                this.isUserLoggedIn = isLoggedIn);
    }

    private navigateTo(url: string) {
        this.navService.navigateByUrl(url);
        this.sidenavService.isSidebarOpen = false;
    }

    private onToggleClick() {
        this.sidenavService.isSidebarOpen = !this.sidenavService.isSidebarOpen;
    }

    private onTitleClick() {
        this.navigateTo('task_view');
    }

    private onViewArchivedClick() {
        this.taskService.shouldShowArchived = 
                !this.taskService.shouldShowArchived;
        if (this.taskService.shouldShowArchived) {
            this.viewArchivedButtonText = 'View Unarchived Tasks';
        } else {
            this.viewArchivedButtonText = this.viewArchivedTasksText;
        }
    }

    private onToggleRemoveClick() {
        this.taskService.shouldRemoveOnSwipe = 
                !this.taskService.shouldRemoveOnSwipe;
        if (this.taskService.shouldRemoveOnSwipe) {
            this.toggleRemoveButtonText = 'Turn On Archive-On-Swipe';
        } else {
            this.toggleRemoveButtonText = this.removeOnSwipeText;
        }
    }

    private onDeleteListClick() {
        if (this.isUserLoggedIn) {
            this.listService.removeListByID(this.activeList._id);
        }
    }

    private onRemoveAllCompletedClick() {
        this.taskService.removeAllCompletedTasks();
    }

    private onRemoveAllClick() {
        this.taskService.removeAllTasks();
    }
}
