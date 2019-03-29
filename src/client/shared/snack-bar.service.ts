import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    private durationMultipier = 75;

    constructor(private snackBar: MatSnackBar) {}

    open(message: string) {
        this.snackBar.open(message, null, 
                { duration: message.length * this.durationMultipier });
    }
}
