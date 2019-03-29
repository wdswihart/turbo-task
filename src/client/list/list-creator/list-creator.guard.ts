import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/client/shared/auth.service';
import { NavService } from 'src/client/shared/nav.service';

@Injectable({
    providedIn: 'root'
})
export class ListCreatorGuard implements CanActivate {
    private isUserLoggedIn: boolean;

    constructor(private authService: AuthService, 
            private navService: NavService) {
        this.authService.isLoggedIn$.subscribe(isLoggedIn =>
                this.isUserLoggedIn = isLoggedIn);
    }

    canActivate(next: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot): boolean {
        if (!this.isUserLoggedIn) { 
            this.navService.navigateByUrl('/');
            return false; 
        }
        return true;
    }
}
