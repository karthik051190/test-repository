import { environment } from './../../../../environments/environment';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../../service/user-registration.service';
import { UserLoginService } from '../../../service/user-login.service';
import { CognitoCallback } from '../../../service/cognito.service';

export class NewPasswordUser {
    username: string;
    existingPassword: string;
    password: string;
}
/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'app-newpassword',
    templateUrl: './newpassword.html',
    styleUrls: ['../../../../assets/slotsAssets/css/style.css']

})
export class NewPasswordComponent implements CognitoCallback {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    registrationUser: NewPasswordUser;
    router: Router;
    errorMessage: string;
    cityName: string;
    address: string;
    website: string;
    newPasswordStep = false;

    constructor(public userRegistration: UserRegistrationService, public userService: UserLoginService, router: Router) {
        this.router = router;
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
        this.onInit();
        this.registrationUser.password = '';
    }

    onInit() {
        this.registrationUser = new NewPasswordUser();
        this.errorMessage = null;
    }

    ngOnInit() {
        this.errorMessage = null;
        console.log('Checking if the user is already authenticated. If so, then redirect to the secure site');
        this.userService.isAuthenticated(this);
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    onRegister() {
        console.log(this.registrationUser);
        this.newPasswordStep = true;
        sessionStorage.setItem('newPasswordStep', 'true');
        this.errorMessage = null;
        this.userRegistration.newPassword(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.errorMessage = message;
            console.log('result: ' + this.errorMessage);
        } else { // success
            // move to the next step
            console.log('redirecting to logout');
            // sessionStorage.setItem('firstPassword', 'true');
            // if (localStorage.getItem('superAdmin') === 'true') {
            alert('Account is activated successfully, please login with new password to continue!');
            this.router.navigate(['/admin/logout']);
            // } else {this.router.navigate(['/admin/logout']); }
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            // sessionStorage.setItem('firstPassword', 'true');
            // if (localStorage.getItem('superAdmin') === 'true') {
            alert('Account is activated successfully, please login with new password to continue!');
            this.router.navigate(['/admin/logout']);
            // } else {this.router.navigate(['/admin/logout']); } 
        }
    }
}
