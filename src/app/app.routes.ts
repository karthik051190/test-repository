import { CheckStatusComponent } from './public/check-status/check-status.component';
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomeComponent, HomeLandingComponent} from './public/home.component';
import {AdminComponent} from './admin.component';
import {GroundsComponent} from './secure/grounds/grounds.component';
import {SlotsComponent} from './secure/slots/slots.component';
import {ParksComponent} from './secure/parks/parks.component';
import {ParkDefaultsComponent} from './secure/parkDefaults/parkDefaults.component';
import {AdminsComponent} from './secure/admins/admins.component';
import {LoginComponent} from './public/auth/login/login.component';
import {RegisterComponent} from './public/auth/register/registration.component';
import {ForgotPassword2Component, ForgotPasswordStep1Component} from './public/auth/forgot/forgotPassword.component';
import {LogoutComponent, ConfirmRegistrationComponent} from './public/auth/confirm/confirmRegistration.component';
import {ResendCodeComponent} from './public/auth/resend/resendCode.component';
import {NewPasswordComponent} from './public/auth/newpassword/newpassword.component';
import {UnauthorizedComponent} from './secure/unauthorized/unauthorized.component';
import {ErrorComponent} from './secure/error/error.component';
import {AddCityComponent} from './public/add-city/add-city.component';
import {CityRequestsComponent} from './secure/city-requests/city-requests.component';
import {LandingComponent} from './public/landing/landing.component';
import {PricingComponent} from './public/pricing/pricing.component';

const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home', component: HomeComponent, children: [
            { path: 'login', component: LoginComponent },
            // {path: 'register', component: RegisterComponent},
            {path: 'accountActivation/:username', component: ConfirmRegistrationComponent},
            {path: 'resendCode', component: ResendCodeComponent},
            {path: 'forgotPassword/:email', component: ForgotPassword2Component},
            {path: 'forgotPassword', component: ForgotPasswordStep1Component},
            {path: 'newPassword', component: NewPasswordComponent},
            {path: 'addCity', component: AddCityComponent},
            {path: 'landing', component: LandingComponent},
            {path: 'land', component: HomeLandingComponent},
            {path: 'pricing', component: PricingComponent},
            {path: 'checkStatus', component: CheckStatusComponent},
            {path: '', component: LandingComponent}
        ]
    },
];

const adminRoutes: Routes = [
    {

        path: '',
        redirectTo: '/admin',
        pathMatch: 'full'
    },
    {
        path: 'admin', component: AdminComponent, children: [
            { path: 'logout', component: LogoutComponent },
            // {path: 'parkDefaults', component: ParkDefaultsComponent},
            { path: 'slots', component: SlotsComponent },
            { path: 'grounds', component: GroundsComponent },
            { path: 'parks', component: ParksComponent },
            { path: 'admins', component: AdminsComponent },
            { path: 'unauthorized', component: UnauthorizedComponent },
            { path: 'error', component: ErrorComponent },
            { path: 'cityRequests', component: CityRequestsComponent },
            { path: '', component: SlotsComponent }],
    },
    {
        path: 'parkDefaults', component: ParkDefaultsComponent
    }
];

const routes: Routes = [
    {
        path: '',
        children: [
            ...homeRoutes,
            ...adminRoutes,
            {
                path: '',
                component: HomeComponent
            }
        ]
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
