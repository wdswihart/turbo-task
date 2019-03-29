import { Injectable } from "@angular/core";
import { AuthService } from "../shared/auth.service";

@Injectable({
    providedIn: 'root'
})
export class ToolbarService {
    shouldShowMenuButton = true;

    constructor(private authService: AuthService) {
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            if (!isLoggedIn) {
                this.shouldShowMenuButton = false;
            }
        })
    }
}
