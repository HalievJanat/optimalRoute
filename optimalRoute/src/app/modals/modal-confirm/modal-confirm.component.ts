import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-confirm',
    standalone: true,
    templateUrl: './modal-confirm.component.html',
})
export class ModalConfirmComponent {
    activeModal = inject(NgbActiveModal);

    deletedObj: string = '';
    relatedObjects: string[] = [];
}
