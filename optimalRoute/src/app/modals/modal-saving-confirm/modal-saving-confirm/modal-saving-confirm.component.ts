import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-saving-confirm',
    standalone: true,
    templateUrl: './modal-saving-confirm.component.html',
})
export class ModalSavingConfirmComponent {
    activeModal = inject(NgbActiveModal);
}
