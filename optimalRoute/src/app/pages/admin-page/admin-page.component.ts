import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [HeaderComponent, NgbDatepickerModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
	isLeftPanelOpen = true;
	isRightPanelOpen = true;
}
