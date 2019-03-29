import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenPayload } from './interfaces/token-payload.interface';
import { TokenResponse } from './interfaces/token-response.interface';
import { TaskService } from '../task/task.service';
import { Properties } from './properties.enum';
import { NavService } from './nav.service';
import { UserDetails } from './interfaces/user-details.interface';
import { SnackBarService } from './snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private readonly tokenName = 'turbo-task-token';
    redirectUrl: string;

    private isLoggedIn = false;
    private isLoggedInSource = new BehaviorSubject<boolean>(this.isLoggedIn);
    isLoggedIn$ = this.isLoggedInSource.asObservable();

    constructor(private http: HttpClient, 
            private navService: NavService,
            private snackBarService: SnackBarService) {
        this.checkLoggedIn();
    }

    private setIsLoggedIn(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn;
        this.isLoggedInSource.next(this.isLoggedIn);
    }

    private saveToken(token: string) {
        localStorage.setItem(this.tokenName, token);
        this.token = token;
    }

    private getToken(): string {
        if (!this.token) {
            this.token = localStorage.getItem(this.tokenName);
        }
        return this.token;
    }

    logOut() {
        this.token = '';
        window.localStorage.removeItem(this.tokenName);
        this.navService.navigateByUrl('/');
        this.setIsLoggedIn(false);
    }

    getUserDetails(): UserDetails {
        const token = this.getToken();
        if (token) {
            let payload = token.split('.')[1];
            payload = window.atob(payload);
            return JSON.parse(payload);
        }
        return null;
    }

    getUsername(): string {
        return this.getUserDetails().username;
    }

    checkLoggedIn() {
        const user = this.getUserDetails();
        if (user) {
            this.setIsLoggedIn(user.expiryDate > Date.now() / 1000);
            return;
        }
        this.setIsLoggedIn(false);
    }
    
    // isLoggedIn(): boolean {
    //     const user = this.getUserDetails();
    //     if (user) {
    //         return user.expiryDate > Date.now() / 1000;
    //     }
    //     return false;
    // }

    private request(method: 'post' | 'get', 
                    type: 'login' | 'register',
                    user?: TokenPayload): Observable<any> {
        let base;

        if (method === 'post') {
            base = this.http.post(Properties.baseURL + `/api/${type}`, user);
        } else {
            base = this.http.get(Properties.baseURL + `/api/${type}`, { 
                headers: { 
                    Authorization: `Bearer ${this.getToken()}` 
                }
            });
        }

        const request = base.pipe(map((data: TokenResponse) => {
            if (data.token) {
                this.saveToken(data.token);
            }
            this.checkLoggedIn();
            return data;
        }));

        return request;
    }

    register(user: TokenPayload): Observable<any> {
        return this.request('post', 'register', user);
    }

    logIn(user: TokenPayload): Observable<any> {
        return this.request('post', 'login', user);
    }

    changePassword(newPassword: string) {
        this.http.put(Properties.baseURL + '/api/password', {
            username: this.getUsername(),
            password: newPassword
        }).subscribe((user: UserDetails) => {
            if (user._id) {
                this.snackBarService.open('Successfully changed password.');
                this.navService.navigateByUrl('task_view');
            }
        });
    }
 }
