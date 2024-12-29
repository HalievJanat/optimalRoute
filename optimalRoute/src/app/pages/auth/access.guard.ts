import { inject } from '@angular/core';
import { authUser } from './auth-user-constant';
import { Router } from '@angular/router';

export const canActivateAuth = (route: import('@angular/router').ActivatedRouteSnapshot) => {
    const router = inject(Router);

    if (!authUser.login) {
        return router.navigateByUrl('login');
    }

    const restrictedRoutes = ['admin-page', 'admin-page/db']; // Укажите маршруты, которые требуют adminRole

    // Если пользователь пытается перейти на ограниченные страницы без adminRole
    if (!authUser.adminRole && restrictedRoutes.includes(route.routeConfig?.path || '')) {
        return router.navigateByUrl('user-page'); // Или вернуть false
    }

    return true;
};
