import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { AuthFormComponent } from '../auth-form/auth-form.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HeaderComponent, AuthFormComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

}
