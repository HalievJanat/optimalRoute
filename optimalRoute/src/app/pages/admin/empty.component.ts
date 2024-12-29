import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    templateUrl: './empty.component.html',
})
export class EmptyComponent {
    constructor(private router: Router) {
        this.router.navigateByUrl('admin-page');
    }
}
