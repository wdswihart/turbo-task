import { Component, OnInit, ViewChild, 
        ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { TaskDetails } from 'src/client/shared/interfaces/task-details.interface';
import { TaskService } from '../task.service';
import { MatCheckboxChange } from '@angular/material';
import { ToolbarService } from 'src/client/toolbar/toolbar.service';
import { NavService } from 'src/client/shared/nav.service';

@Component({
    selector: 'turbo-task-task-view',
    templateUrl: './task-view.component.html',
    styleUrls: [ './task-view.component.scss' ]
})
export class TaskViewComponent implements OnInit {
    private tasks: TaskDetails[];
    private isUserLoggedIn = false;
    @ViewChild('taskList', { read: ElementRef }) taskList: ElementRef;

    constructor(private authService: AuthService,
            private taskService: TaskService,
            private toolbarSerivce: ToolbarService,
            private cdr: ChangeDetectorRef,
            private navService: NavService) {}

    ngOnInit() {
        this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            this.isUserLoggedIn = isLoggedIn;
            this.toolbarSerivce.shouldShowMenuButton = true;
        });
    }

    private onCheckboxChange(event: MatCheckboxChange, task: TaskDetails) {
        this.taskService.updateTaskCompletion(task, event.checked)
    }

    private onTaskSwipe(event: any, task: TaskDetails) {
        if (this.taskService.shouldRemoveOnSwipe) {
            this.taskService.removeTasks([ task ]);
        } else {
            this.taskService.updateTaskArchived(task, !task.isArchived);
        }
    }

    private shouldShowEmptyListText() {
        if (this.taskService.shouldShowArchived) {
            if (this.tasks.filter(task => task.isArchived).length === 0) {
                return true;
            }
            return false;
        } else {
            if (this.tasks.filter(task => !task.isArchived).length === 0) {
                return true;
            }
            return false;
        }
    }
}
