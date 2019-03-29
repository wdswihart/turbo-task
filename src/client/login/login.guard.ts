import { Injectable } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavService } from '../shared/nav.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    private isUserLoggedIn = false;

    constructor(private authService: AuthService, 
            private navService: NavService) {
        this.authService.isLoggedIn$.subscribe(isLoggedIn =>
                this.isUserLoggedIn = isLoggedIn);
    }

    canActivate(next: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot): boolean {
        if (this.isUserLoggedIn) { 
            this.navService.navigateByUrl('/');
            return false; 
        }
        return true;
    }
}

