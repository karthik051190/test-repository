import { environment } from './../../../../environments/environment';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserLoginService } from "../../../service/user-login.service";
import { CognitoCallback } from "../../../service/cognito.service";

@Component({
    selector: 'app-forgotPassword',
    templateUrl: './forgotPassword.html',
    styleUrls: ['../../../../assets/slotsAssets/css/style.css']
})
export class ForgotPasswordStep1Component implements CognitoCallback {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    cityName: string;
    loadingBar = false;
    address: string;
    website: string;
    email: string;
    errorMessage: string;
    // forgotPassNext = false;

    constructor(public router: Router,
        public userService: UserLoginService) {
        this.errorMessage = null;
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    onNext() {
        // this.forgotPassNext = true;
        this.errorMessage = null;
        this.userService.forgotPassword(this.email, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message == null && result == null) { // error
            this.router.navigate(['/home/forgotPassword', this.email]);
        } else { // success
            this.errorMessage = message;
        }
    }
}


@Component({
    selector: 'app-forgotPasswordStep2',
    templateUrl: './forgotPasswordStep2.html',
    styleUrls: ['../../../../assets/slotsAssets/css/style.css']
})
export class ForgotPassword2Component implements CognitoCallback, OnInit, OnDestroy {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    cityName: string;
    loadingBar = false;
    address: string;
    website: string;
    verificationCode: string;
    email: string;
    password: string;
    errorMessage: string;
    private sub: any;

    constructor(public router: Router, public route: ActivatedRoute,
        public userService: UserLoginService) {
        console.log("email from the url: " + this.email);
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['email'];

        });
        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onNext() {
        this.loadingBar = true;
        this.errorMessage = null;
        this.userService.confirmNewPassword(this.email, this.verificationCode, this.password, this);

    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    cognitoCallback(message: string) {
        if (message != null) { // error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
        } else { // success
            this.loadingBar = false;
            alert('Password has been reset successfully');
            this.router.navigate(['/home/login']);
        }
    }

}