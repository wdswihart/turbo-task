import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { ListDetails } from "../shared/interfaces/list-details.interface";
import { Properties } from "../shared/properties.enum";
import { AuthService } from "../shared/auth.service";
import { catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { SnackBarService } from "../shared/snack-bar.service";

@Injectable({
    providedIn: 'root'
})
export class ListService {
    private lists: ListDetails[] = [];
    private listsSource = new BehaviorSubject<ListDetails[]>([]);
    lists$ = this.listsSource.asObservable();

    private activeList: ListDetails;
    private activeListSource = new BehaviorSubject<ListDetails>(this.activeList);
    activeList$ = this.activeListSource.asObservable();

    private isUserLoggedIn = false;

    constructor(private authService: AuthService, 
            private http: HttpClient,
            private snackBarService: SnackBarService) {
        this.loadLists();
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            this.isUserLoggedIn = isLoggedIn;
            if (isLoggedIn) {
                this.loadLists();
            } else {
                this.lists = [];
                this.listsSource.next([]);
            }
        });
    }

    loadLists() {
        if (this.isUserLoggedIn) {
            this.http.get(Properties.baseURL + '/api/lists/' + 
                    this.authService.getUsername())
                    .subscribe((lists: ListDetails[]) => {
                if (lists && lists[0] && lists[0]._id) {
                    this.lists = lists;
                    this.listsSource.next(this.lists);

                    this.setActiveList(this.authService
                        .getUserDetails().mostRecentListID);
                } else {
                    console.error('Failed to load lists.');
                }
            });
        }
    }

    setActiveList(_id?: string, name?: string) {
        if (_id) {
            this.activeList = this.lists.find(list => list._id === _id);
            this.activeListSource.next(this.activeList);
        } else if (name) {
            this.activeList = this.lists.find(list => list.name === name);
            this.activeListSource.next(this.activeList);
        }
    }

    addListByName(name: string) {
        console.log(Properties.baseURL + '/api/list');
        if (this.isUserLoggedIn) {
            this.http.post(Properties.baseURL + '/api/list', {
                _id: null,
                username: this.authService.getUsername(),
                name: name
            }).subscribe((res: ListDetails) => {
                if (res && res._id) {
                    this.lists.push(res);
                    this.listsSource.next(this.lists);
                    this.snackBarService.open(`Added list "${name}".`)
                } else {
                    this.snackBarService.open(`Failed to add list "${name}".`);
                }
            });
        }
    }

    removeListByID(_id: string) {
        if (this.isUserLoggedIn) {
            if (_id !== this.getDefaultList()._id) {
                this.http.delete(Properties.baseURL + '/api/list/' + _id)
                        .subscribe((list: ListDetails) => {
                    if (list && list._id) {
                        this.lists.splice(this.lists.indexOf(list), 1);
                        this.listsSource.next(this.lists);
                        this.activeList = this.getDefaultList();
                        this.activeListSource.next(this.activeList);
                        this.snackBarService
                                .open(`Removed list "${list.name}".`);
                    } else {
                        this.snackBarService
                                .open(`Failed to remove list "${list.name}".`);
                    }
                });
            }
        }
    }

    getDefaultList(): ListDetails {
        if (this.isUserLoggedIn) {
            return this.lists.find(list => list.username === 
                    this.authService.getUsername() && list.name === 
                    'Default List');
        }
    }
}
