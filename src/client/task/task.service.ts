import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { TaskDetails } from '../shared/interfaces/task-details.interface';
import { AuthService } from '../shared/auth.service';
import { Properties } from '../shared/properties.enum';
import { ListService } from '../list/list.service';
import { ListDetails } from '../shared/interfaces/list-details.interface';
import { SnackBarService } from '../shared/snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasks: TaskDetails[] = [];
    private tasksSource = new BehaviorSubject<TaskDetails[]>([]);
    tasks$ = this.tasksSource.asObservable();

    private activeList: ListDetails;
    private isUserLoggedIn = false;

    shouldShowArchived = false;
    shouldRemoveOnSwipe = false;

    constructor(private authService: AuthService, 
            private http: HttpClient,
            private listService: ListService,
            private snackBarService: SnackBarService) {
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            this.isUserLoggedIn = isLoggedIn;
            if (!isLoggedIn) {
                this.tasks = [];
                this.tasksSource.next([]);
            } else {
                this.addUnloggedTasksToDefaultList();
            }
        });
        this.listService.activeList$.subscribe(activeList => {
            if (activeList) {
                this.activeList = activeList;
                this.loadTasksForListID(activeList._id);
            }
        });
    }

    loadTasksForListID(_id: string) {
        if (this.isUserLoggedIn) {
            this.http.get(`${Properties.baseURL}/api/${_id}/tasks`)
                    .subscribe((res: TaskDetails[]) => {
                if (res && res[0] && res[0]._id) {
                    this.tasks = res;
                    this.tasksSource.next(this.tasks);
                    return;
                }
            });
        }
        this.tasks = [];
        this.tasksSource.next(this.tasks);
    }

    addTask(task: TaskDetails) {
        let resultMessage = `task "${task.title}".`;
        if (this.isUserLoggedIn) {
            this.http.post(Properties.baseURL + '/api/task', task)
                    .subscribe((res: TaskDetails) => {
                if (res && res._id) {
                    this.tasks.push(res);
                    this.tasksSource.next(this.tasks);
                    resultMessage = 'Added ' + resultMessage;
                } else {
                    resultMessage = 'Failed to add ' + resultMessage;
                }
                this.snackBarService.open(resultMessage);
            });
        } else {
            this.tasks.push(task);
            this.tasksSource.next(this.tasks);
            resultMessage = 'Added ' + resultMessage;
            this.snackBarService.open(resultMessage);
        }
    }

    updateTask(original: TaskDetails, update: TaskDetails) {
        if (this.isUserLoggedIn) {
            this.http.put(Properties.baseURL + '/api/task', { 
                    original: original, update: update})
                    .subscribe((res: TaskDetails) => {
                if (res && res._id) {
                    const i = this.tasks.indexOf(original);
                    this.tasks.fill(res, i, i + 1);
                    this.tasksSource.next(this.tasks);
                    if (update.isArchived != original.isArchived) {
                        this.snackBarService.open(
                                `${update.isArchived ? 'A' : 'Una'}rchived ` +
                                `"${update.title}".`)
                    }
                }
            });
        }
    }

    updateTaskCompletion(task: TaskDetails, isComplete: boolean) {
        const updatedTask = {
            _id: task._id,
            title: task.title,
            description: task.description,
            goalDate: task.goalDate,
            listID: task.listID,
            isArchived: task.isArchived,
            isComplete: isComplete
        };
        this.updateTask(task, updatedTask);
    }

    updateTaskArchived(task: TaskDetails, isArchived: boolean) {
        const updatedTask = {
            _id: task._id,
            title: task.title,
            description: task.description,
            goalDate: task.goalDate,
            listID: task.listID,
            isArchived: isArchived,
            isComplete: task.isComplete
        };
        this.updateTask(task, updatedTask);
    }

    removeTasks(tasks: TaskDetails[]) {
        let resultMessage = `${tasks.length} ` + 
                `task${tasks.length == 1 ? '' : 's'}.`;
        if (this.isUserLoggedIn) {
            let query = '?';
            for (let task of tasks) {
                query += `_id=${task._id}&`;
            }
            query = query.substring(0, query.length - 1);
            this.http.delete(Properties.baseURL + '/api/tasks' + query)
                    .subscribe(res => {
                if (res === 'Removed tasks.') {
                    for (let task of tasks) {
                        this.tasks.splice(this.tasks.indexOf(task), 1);
                    }
                    this.tasksSource.next(this.tasks);
                    resultMessage = 'Removed ' + resultMessage;
                } else {
                    resultMessage = 'Failed to remove ' + resultMessage;
                }
                this.snackBarService.open(resultMessage);
            });
        } else {
            for (let task of tasks) {
                this.tasks.splice(this.tasks.indexOf(task), 1);
            }
            this.tasksSource.next(this.tasks);
            resultMessage = 'Removed ' + resultMessage;
            this.snackBarService.open(resultMessage);
        }
    }

    removeAllCompletedTasks() {
        if (this.tasks.filter(task => task.isComplete).length > 0) {
            this.removeTasks(this.tasks.filter(task => task.isComplete));
        }
    }

    removeAllTasks() {
        if (this.tasks.length > 0) {
            this.removeTasks(this.tasks.filter(task => true));
        }
    }

    getDefaultListIDForUsername(username: string) {
        if (this.isUserLoggedIn) {
            let id;
            this.http.get(Properties.baseURL + '/api/default_list/' + username)
                    .subscribe((list: ListDetails) => {
                id = list._id;
            });
            return id;
        }
    }

    addUnloggedTasksToDefaultList() {
        if (this.isUserLoggedIn) {
            if (this.tasks.length > 0) {
                let unloggedTasks = this.tasks.splice(0, this.tasks.length);
                const defaultListID = this.getDefaultListIDForUsername(
                    this.authService.getUsername());
                for (let task of unloggedTasks) {
                    task.listID = defaultListID;
                    this.addTask(task);
                }
            }
        }
    }

    isGoalDateNear(goalDate: Date): boolean {
        if (goalDate) {
            if (goalDate.getTime() / 1000 >= Date.now() / 1000 - 172800 &&
                    goalDate.getTime() < Date.now()) {
                return true;
            }
        }
        return false;
    }

    isGoalDatePast(goalDate: Date): boolean {
        if (goalDate) {
            if (goalDate.getTime() > Date.now()) {
                return true;
            }
        }
        return false;
    }
}
