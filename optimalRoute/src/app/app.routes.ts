import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AdminDbComponent } from './pages/admin/admin-db/admin-db.component';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

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
    {
        path: 'admin-page/db',
        component: AdminDbComponent,
    },
    {
        path: 'user-page',
        component: UserPageComponent,
    }
];
