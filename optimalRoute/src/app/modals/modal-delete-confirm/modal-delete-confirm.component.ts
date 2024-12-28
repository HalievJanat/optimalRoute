import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-confirm',
    standalone: true,
    templateUrl: './modal-delete-confirm.component.html',
})
export class ModalDeleteConfirmComponent {
    activeModal = inject(NgbActiveModal);

    @Input() deletedObj: string = '';
    @Input() relatedObjects: string[] = [];
}
