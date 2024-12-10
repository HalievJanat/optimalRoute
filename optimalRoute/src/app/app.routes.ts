import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';

export const routes: Routes = [
    {
        path: '',
        component: MainPageComponent,
    },
    {
        path: 'registration',
        component: RegistrationComponent,
    },
];
