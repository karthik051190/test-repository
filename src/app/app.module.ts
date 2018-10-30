import { CheckStatusComponent } from './public/check-status/check-status.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import {BrowserModule} from "@angular/platform-browser";
import {EventEmitter, NgModule, Output} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {HttpModule} from "@angular/http";
import { AppComponent } from "./app.component";
import { UserRegistrationService } from "./service/user-registration.service";
import { UserParametersService } from "./service/user-parameters.service";
import { UserLoginService } from "./service/user-login.service";
import { CognitoUtil } from "./service/cognito.service";
import { routing } from "./app.routes";
import { HomeComponent, HomeLandingComponent } from "./public/home.component";
import { AwsUtil } from "./service/aws.service";
import { AdminsComponent } from "./secure/admins/admins.component";
import { GroundsComponent } from "./secure/grounds/grounds.component";
import { AdminComponent } from "./admin.component";
import { SlotsComponent } from "./secure/slots/slots.component";
import { ParksComponent } from "./secure/parks/parks.component";
import { ParkDefaultsComponent } from "./secure/parkDefaults/parkDefaults.component";
import { LoginComponent } from "./public/auth/login/login.component";
import { RegisterComponent } from "./public/auth/register/registration.component";
import { ForgotPassword2Component, ForgotPasswordStep1Component } from "./public/auth/forgot/forgotPassword.component";
import { LogoutComponent, ConfirmRegistrationComponent } from "./public/auth/confirm/confirmRegistration.component";
import { ResendCodeComponent } from "./public/auth/resend/resendCode.component";
import { NewPasswordComponent } from "./public/auth/newpassword/newpassword.component";
import { MFAComponent } from './public/auth/mfa/mfa.component';
import { ChartModule } from 'primeng/chart';
// import { CalendarComponent } from './calendar/calendar.component';
// import { DropdownModule } from 'angular-custom-dropdown';

import { FullCalendarModule } from 'ng-fullcalendar';
import { SlotsCalendarComponent } from './secure/slots/slots-calendar/slots-calendar.component';
import { SlotsService } from './service/slots.service';
import { TopNavComponent } from './secure/top-nav/top-nav.component';
import { SideBarComponent } from './secure/side-bar/side-bar.component';
import { ParksService } from './service/parks.service';
import { UserIdleModule } from 'angular-user-idle';
import { ConfirmationService, MenuItem } from 'primeng/api';
import {CalendarModule, ConfirmDialogModule, DropdownModule, MessagesModule, ProgressSpinnerModule, MenuModule, InputSwitchModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DialogModule} from 'primeng/dialog';
import {AdminsService} from './service/admins.service';
import {HttpClientModule} from '@angular/common/http';
import {UserFormService} from './service/user-form.service';
import { GroundsService } from "./service/grounds.service";
// import {ConfirmationService} from 'primeng/api';
import { AutoCompleteModule, CheckboxModule } from 'primeng/primeng';
import { CityRequestsComponent } from './secure/city-requests/city-requests.component';
import { CityRequestsService } from "./service/city-requests.service";
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AddCityComponent } from './public/add-city/add-city.component';
import { CitiesService } from "./service/cities.service";
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { FormsModule }   from '@angular/forms';
// import { CalendarComponent } from './calendar/calendar.component';
import { PopoverModule } from "ng2-popover";
import { GrowlModule } from 'primeng/growl';
import { MessageService } from 'primeng/components/common/messageservice';
import { UnauthorizedComponent } from './secure/unauthorized/unauthorized.component';
import { ErrorComponent } from './secure/error/error.component';
import { LandingComponent } from './public/landing/landing.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PricingComponent } from './public/pricing/pricing.component';
import {StepsModule} from 'primeng/steps'
import { RecaptchaModule } from 'ng-recaptcha';
import {TabViewModule} from 'primeng/tabview';

// import {MenuItem} from 'primeng/api';

// import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';




@NgModule({
    declarations: [
        NewPasswordComponent,
        LoginComponent,
        LogoutComponent,
        ConfirmRegistrationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPassword2Component,
        RegisterComponent,
        MFAComponent,
        ParkDefaultsComponent,
        HomeLandingComponent,
        HomeComponent,
        UnauthorizedComponent,
        ErrorComponent,
        ParksComponent,
        AdminsComponent,
        GroundsComponent,
        AdminComponent,
        SlotsComponent,
        AppComponent,
        // CalendarComponent,
        SlotsCalendarComponent,
        TopNavComponent,
        SideBarComponent,
        AddCityComponent,
        CityRequestsComponent,
        LandingComponent,
        PricingComponent,
        CheckStatusComponent
    ],
    imports: [
        BrowserModule,
        InputSwitchModule,
        HttpClientModule,
        // HttpModule,
        FormsModule,
        ReactiveFormsModule,
        // NgbModule.forRoot(),
        FormsModule,
        routing,
        FullCalendarModule,
        BrowserAnimationsModule,
        CalendarModule,
        DropdownModule,
        DialogModule,
        UserIdleModule.forRoot({ idle: 600, timeout: 3, ping: 1 }),
        ChartModule,
        RadioButtonModule,
        ReactiveFormsModule,
        CheckboxModule,
        // HttpModule,
        routing,
        FullCalendarModule,
        MessagesModule,
        GrowlModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        BrowserAnimationsModule,
        PopoverModule,
        StepsModule,
        MenuModule,
        NgbModule.forRoot(),
        RecaptchaModule.forRoot(),
        TabViewModule
    ],
    providers: [
        CognitoUtil,
        AwsUtil,
        SlotsService,
        UserRegistrationService,
        UserLoginService,
        ConfirmationService,
        UserParametersService,
        AdminsService,
        ParksService,
        UserFormService,
        MessageService,
        GroundsService,
        UserParametersService,
        CitiesService,
        CityRequestsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
