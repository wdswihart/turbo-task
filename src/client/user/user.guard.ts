import { Injectable } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavService } from '../shared/nav.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    private isUserLoggedIn = false;

    constructor(private authService: AuthService, 
            private navService: NavService) {
        this.authService.isLoggedIn$.subscribe(isLoggedIn =>
                this.isUserLoggedIn = isLoggedIn);
    }

    canActivate(next: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot): boolean {
        return this.checkLogin(next, state.url);
    }

    checkLogin(next: ActivatedRouteSnapshot, url: string): boolean {
        if (this.isUserLoggedIn) {
            if (this.authService.getUserDetails().username ===
                    next.paramMap.get('user')) { 
                return true;
            }
            this.navService.navigateByUrl('/');
            return true;
        }

        this.authService.redirectUrl = url;
        this.navService.navigateByUrl('/login');
        return false;
    }
}
