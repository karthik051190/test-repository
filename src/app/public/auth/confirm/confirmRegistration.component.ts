import { environment } from './../../../../environments/environment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegistrationService } from '../../../service/user-registration.service';
import { UserLoginService } from '../../../service/user-login.service';
import { LoggedInCallback } from '../../../service/cognito.service';

@Component({
    selector: 'app-logout',
    template: ''
})
export class LogoutComponent implements LoggedInCallback {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    constructor(public router: Router,
        public userService: UserLoginService) {
        this.userService.isAuthenticated(this)
    }
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.userService.logout();
            this.router.navigate(['/home/land']);
        }

        this.router.navigate(['/home/land']);
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
}

@Component({
    selector: 'app-accountActivation',
    templateUrl: './confirmRegistration.html',
    styleUrls: ['../../../../assets/slotsAssets/css/style.css']

})
export class ConfirmRegistrationComponent implements OnInit, OnDestroy {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    cityName: string;
    state: string;
    address: string;
    website: string;
    confirmationCode: string;
    email: string;
    errorMessage: string;
    private sub: any;

    constructor(public regService: UserRegistrationService, public router: Router, public route: ActivatedRoute) {
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['username'];

        });

        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    onAccountActivation() {
        this.errorMessage = null;
        this.regService.accountActivation(this.email, this.confirmationCode, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.errorMessage = message;
            console.log('message: ' + this.errorMessage);
        } else { // success
            // move to the next step
            console.log('Moving to admin');
            // this.configs.curUser = result.user;
            if (localStorage.getItem('superAdmin') === 'true') {
                this.router.navigate(['/admin/cityRequests']);
            } else {
                // this.router.navigate(['/admin']);
                alert('Account is activated successfully, please login with new password to continue!');
                this.router.navigate(['/admin/logout']);
            }
        }
    }
}





