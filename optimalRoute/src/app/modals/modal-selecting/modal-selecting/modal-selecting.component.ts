import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-selecting',
    standalone: true,
    imports: [],
    templateUrl: './modal-selecting.component.html',
    styleUrl: './modal-selecting.component.scss',
})
export class ModalSelectingComponent {
    activeModal = inject(NgbActiveModal);

	mapList: string[] = [];
}
