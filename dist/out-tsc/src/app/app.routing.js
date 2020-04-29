import { RouterModule } from '@angular/router';
import { PageMainComponent } from './app.page-main';
import { PageRegisterComponent } from './app.page-register';
import { PageLoginComponent } from './app.page-login';
import { PageShopComponent } from './app.page-shop';
const appRoutes = [
    { path: 'page-main', component: PageMainComponent },
    { path: '', redirectTo: '/page-login', pathMatch: 'full' },
    { path: 'page-register', component: PageRegisterComponent },
    { path: 'page-login', component: PageLoginComponent },
    { path: 'page-shop', component: PageShopComponent }
];
export const routing = RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map