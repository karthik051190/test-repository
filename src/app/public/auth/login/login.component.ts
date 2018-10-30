import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../../service/user-login.service';
import { ChallengeParameters, CognitoCallback, LoggedInCallback } from '../../../service/cognito.service';
import { UserIdleService } from 'angular-user-idle';
import * as jwt_decode from 'jwt-decode';


@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['../../../../assets/slotsAssets/css/style.css']
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    cityName: string;
    address: string;
    website: string;
    email: string;
    loadingBar = false;
    password: string;
    errorMessage: string;
    mfaStep = false;
    mfaData = { destination: '', callback: null };

    constructor(public router: Router, public userService: UserLoginService, private userIdle: UserIdleService) {
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
        console.log('LoginComponent constructor');
    }

    ngOnInit() {
        // if (sessionStorage.getItem('firstPassword') === 'true'){
        //     alert('Account setup successfull!');
        //     sessionStorage.removeItem('firstPassword');
        // }
        this.errorMessage = null;
        console.log('Checking if the user is already authenticated. If so, then redirect to the secure site');
        this.userService.isAuthenticated(this);
        // Start watching for user inactivity.
        this.userIdle.startWatching();

        // Start watching when user idle is starting.
        this.userIdle.onTimerStart().subscribe(count => console.log(count));

        // Start watch when time is up.
        this.userIdle.onTimeout().subscribe(() =>
            this.router.navigate(['/admin/logout']));
        // alert('Logged out due to inactivity');
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    stop() {
        this.userIdle.stopTimer();
    }

    stopWatching() {
        this.userIdle.stopWatching();
    }

    startWatching() {
        this.userIdle.startWatching();
    }

    restart() {
        this.userIdle.resetTimer();
    }

    onLogin() {
        if (this.email == null || this.password == null) {
            this.errorMessage = 'All fields are required';
            return;
        }
        this.loadingBar = true;
        this.errorMessage = null;
        this.userService.authenticate(this.email, this.password, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.loadingBar = false;
            this.errorMessage = message;
            console.log('result: ' + this.errorMessage);
            if (this.errorMessage === 'User is not confirmed.') {
                console.log('redirecting');
                this.router.navigate(['/home/accountActivation', this.email]);
            } else if (this.errorMessage === 'User needs to set password.') {
                console.log('redirecting to set new password');
                this.router.navigate(['/home/newPassword']);
            }
        } else { // success
            let params = sessionStorage.getItem('authorizationToken');
            let tokenInfo = this.getDecodedAccessToken(result.getIdToken().getJwtToken());
            console.log('This is the token info', tokenInfo);
            if (tokenInfo['cognito:groups'][0] === 'SystemAdmin') {
                console.log('this is the console for system admin');
                localStorage.setItem('superAdmin', 'true');
                // this.loadingBar = false;
                this.router.navigate(['/admin/cityRequests']);
            } else {
                this.userService.getUserDetails(params).subscribe(data => {
                    console.log('this is the output from get user details:', data);
                    localStorage.setItem('repId', data[0]['Rep_Id']);
                    localStorage.setItem('repName', data[0]['First_Name'] + ' ' + data[0]['Last_Name']);
                    localStorage.setItem('repInitials', data[0]['First_Name'].charAt(0) + data[0]['Last_Name'].charAt(0));
                    if (data[0]['Default_Park_Id'] === null || data[0]['Default_Park_Id'] === undefined) {
                        // sessionStorage.setItem('repId', data[0]['Rep_Id']);
                        // this.loadingBar = false;
                        this.router.navigate(['/parkDefaults']);
                    } else {
                        localStorage.setItem('defaultParkId', data[0]['Default_Park_Id']);
                        localStorage.setItem('defaultParkName', data[0]['Park_Name']);
                        // sessionStorage.setItem('repId', data[0]['Rep_Id']);
                        this.router.navigate(['/admin']);
                    }
                });
            }
        }
    }
    getDecodedAccessToken(token: string): any {
        console.log('inside the function');
        try {
            console.log('token info in function: ', jwt_decode(token));
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }

    handleMFAStep(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
        this.mfaStep = true;
        this.mfaData.destination = challengeParameters.CODE_DELIVERY_DESTINATION;
        this.mfaData.callback = (code: string) => {
            if (code == null || code.length === 0) {
                this.errorMessage = 'Code is required';
                return;
            }
            this.errorMessage = null;
            callback(code);
        };
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn && localStorage.getItem('superAdmin') === 'true') {
            console.log('this is the super admin isLoggedIn');
            this.router.navigate(['/admin/cityRequests']);
        } else if (isLoggedIn && (localStorage.getItem('defaultParkId') === null || localStorage.getItem('defaultParkId') === 'undefined') && localStorage.getItem('superAdmin') !== 'true') {
            console.log('this is the park defaults isLoggedIn');
            this.router.navigate(['/parkDefaults']);
        } else if (isLoggedIn && localStorage.getItem('defaultParkId') !== null
            && localStorage.getItem('defaultParkId') !== 'undefined') {
            console.log('this is the no park defaults isLoggedIn');
            this.router.navigate(['/admin']);
        }
    }

    cancelMFA(): boolean {
        this.mfaStep = false;
        return false;   // necessary to prevent href navigation
    }
}
