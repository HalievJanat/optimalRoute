import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-developers',
    standalone: true,
    templateUrl: './modal-developers.component.html',
})
export class ModalDevelopersComponent {
    activeModal = inject(NgbActiveModal);
}
