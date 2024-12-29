import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from './auth-user-constant';

export const canActivateAuth = (route: import('@angular/router').ActivatedRouteSnapshot) => {
    const router = inject(Router);
    let item = sessionStorage.getItem('user');

    if (!item) {
        return router.navigateByUrl('login');
    }

    const authUser: AuthUser = JSON.parse(item);

    const restrictedRoutes = ['admin-page', 'admin-page/db']; // Укажите маршруты, которые требуют adminRole

    // Если пользователь пытается перейти на ограниченные страницы без adminRole
    if (!authUser.adminRole && restrictedRoutes.includes(route.routeConfig?.path || '')) {
        return router.navigateByUrl('user-page'); // Или вернуть false
    }

    return true;
};
