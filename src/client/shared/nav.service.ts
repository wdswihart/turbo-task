import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class NavService {
    private currentRoute = '';
    private previousRoute: string;

    constructor(private router: Router) {}

    navigateByUrl(url: string) {
        this.router.navigateByUrl(url);
        this.previousRoute = this.currentRoute;
        this.currentRoute = url;
    }

    navigateBack() {
        this.navigateByUrl(this.previousRoute);
        const temp = this.currentRoute;
        this.currentRoute = this.previousRoute;
        this.previousRoute = temp;
    }
}
