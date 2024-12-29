import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AdminDbComponent } from './pages/admin/admin-db/admin-db.component';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { SystemPageComponent } from './pages/system-page/system-page.component';
import { UserReferencePageComponent } from './pages/user-reference/user-reference-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page/error-page.component';
import { canActivateAuth } from './pages/auth/access.guard';

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
        canActivate: [canActivateAuth],
    },
    {
        path: 'admin-page2',
        component: AdminPageComponent,
        canActivate: [canActivateAuth],
    },
    {
        path: 'admin-page/db',
        component: AdminDbComponent,
        canActivate: [canActivateAuth],
    },
    {
        path: 'user-page',
        component: UserPageComponent,
        canActivate: [canActivateAuth],
    },
    {
        path: 'system-page',
        component: SystemPageComponent,
        canActivate: [canActivateAuth],
    },
    {
        path: 'user-page/user-reference-page',
        component: UserReferencePageComponent,
        canActivate: [canActivateAuth],
    },
    {
        path: 'error-page',
        component: ErrorPageComponent,
        canActivate: [canActivateAuth],
    },
];
