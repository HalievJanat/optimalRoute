import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { NgbDropdownModule, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-system-page',
  standalone: true,
  imports: [HeaderComponent, NgbDropdownModule],
  templateUrl: './system-page.component.html',
  styleUrl: './system-page.component.scss'
})
export class SystemPageComponent {

  constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
	) {
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
	}

  open(content: any) {
		this.modalService.open(content);
	}
}
