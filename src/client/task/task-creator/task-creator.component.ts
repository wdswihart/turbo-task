import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskDetails } from 'src/client/shared/interfaces/task-details.interface';
import { AuthService } from 'src/client/shared/auth.service';
import { TaskService } from '../task.service';
import { ListDetails } from 'src/client/shared/interfaces/list-details.interface';
import { ListService } from 'src/client/list/list.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NavService } from 'src/client/shared/nav.service';

@Component({
    selector: 'turbo-task-task-creator',
    templateUrl: './task-creator.component.html',
    styleUrls: [ './task-creator.component.scss' ]
})
export class TaskCreatorComponent implements OnInit {
    private task: TaskDetails;
    @ViewChild('titleField') titleField: ElementRef;
    private lists: ListDetails[];
    private activeList: ListDetails;
    private listName = new FormControl();
    private listForm: FormGroup;
    private isUserLoggedIn: boolean;

    constructor(private authService: AuthService, 
            private taskService: TaskService,
            private listService: ListService,
            private navService: NavService) {}

    ngOnInit() {
        this.resetTask();
        this.listService.lists$.subscribe(lists => {
            this.lists = lists;
        });
        this.listService.activeList$.subscribe(activeList => {
            if (activeList) {
                this.activeList = activeList;
                this.listName.setValue(activeList.name);
            }
        });
        this.authService.isLoggedIn$.subscribe(isLoggedIn =>
                this.isUserLoggedIn = isLoggedIn);
    }

    private resetTask() {
        this.task = {
            _id: null,
            title: '',
            description: '',
            isComplete: false,
            goalDate: null,
            listID: null,
            isArchived: false
        };
        this.titleField.nativeElement.focus();
    }

    private addTask() {
        if (this.task.title != '') {
            if (this.isUserLoggedIn) {
                this.task.listID = this.lists
                        .find(list => list.name === this.listName.value)._id;
            }
            this.taskService.addTask(this.task);
            this.resetTask();
        }
    }
}
