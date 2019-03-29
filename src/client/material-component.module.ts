import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatToolbarModule, MatRippleModule, MatSidenavModule, MatIconModule, MatExpansionModule, MatOptionModule, MatMenuModule, MatSnackBarModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

@NgModule({
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatRippleModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatExpansionModule,
        MatOptionModule,
        MatSelectModule,
        MatMenuModule,
        MatSnackBarModule
    ],
    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatRippleModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatExpansionModule,
        MatOptionModule,
        MatSelectModule,
        MatMenuModule,
        MatSnackBarModule
    ]
})
export class MaterialComponentModule {}
