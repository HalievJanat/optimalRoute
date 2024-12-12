import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';

export const routes: Routes = [
    {
        path: '',
        component: MainPageComponent,
    },
    {
        path: 'registration',
        component: RegistrationComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'admin-page',
        component: AdminPageComponent,
    },
];
