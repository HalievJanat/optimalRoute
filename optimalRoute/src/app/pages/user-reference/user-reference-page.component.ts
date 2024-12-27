import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { NgbDropdownModule, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-reference-page',
  standalone: true,
  imports: [HeaderComponent, NgbDropdownModule],
  templateUrl: './user-reference-page.component.html',
  styleUrl: './user-reference-page.component.scss'
})
export class UserReferencePageComponent {
}
