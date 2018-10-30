import { Component, OnInit } from '@angular/core';
import { AwsUtil } from './service/aws.service';
import { Router } from '@angular/router';
import { UserLoginService } from './service/user-login.service';
import { CognitoUtil, LoggedInCallback } from './service/cognito.service';
import { UserIdleService } from 'angular-user-idle';
import { CitiesService } from './service/cities.service';


@Component({
    selector: 'app-root',
    templateUrl: 'template/app.html'
})
export class AppComponent implements OnInit, LoggedInCallback {
    routeUrl = '';
    // loadingBar = false;
    // error = false;
    // unauthorized = false;
    constructor(public awsUtil: AwsUtil,
        public router: Router,
        private userIdle: UserIdleService,
        private citiesService: CitiesService,
        public userService: UserLoginService, public cognito: CognitoUtil) {
        console.log('AppComponent: constructor');
    }

    ngOnInit() {
        console.log('AppComponent: Checking if the user is already authenticated');
        this.userService.isAuthenticated(this);
        console.log('thi is the route url', document.URL);
        // this.routeUrl = ((((document.URL).split('.fieldsmanager'))[0]).split('://'))[1];
        this.routeUrl = ((document.URL).replace('www.', '').split('://'))[1];
        console.log('first part of url:', this.routeUrl);
        if (this.routeUrl.toLowerCase().includes('localhost')) {
            // this.getCityDetails('sh');
            // this.router.navigate(['/home/land']);
            this.setSystemAdminDetails();
        } else
            if (this.routeUrl.toLowerCase().includes('fieldsmanager'.toLowerCase())) {
                if ((this.routeUrl.split('fieldsmanager')[0]) === '') {
                    console.log('In home page ---- admin');
                    this.setSystemAdminDetails();
                } else {
                    // this.routeUrl = this.routeUrl.split('.fieldsmanager')[0];
                    console.log('this is the route url in stage', this.routeUrl);
                    this.getCityDetails(this.routeUrl.split('.fieldsmanager')[0]);
                }
            } else if (this.routeUrl.toLowerCase().includes('dev-fm.bizdevworks'.toLowerCase())) {
                if ((this.routeUrl.split('dev-fm.bizdevworks')[0]) === '') {
                    console.log('In home page ---- dev admin');
                    this.setSystemAdminDetails();
                } else {
                    // this.routeUrl = this.routeUrl.split('.dev-fm.bizdevworks')[0];
                    console.log('this is the route url in stage', this.routeUrl);
                    this.getCityDetails(this.routeUrl.split('.dev-fm.bizdevworks')[0]);
                    // this.router.navigate(['/home/land']);
                }
            } else if (this.routeUrl.toLowerCase().includes('stage-fm.bizdevworks'.toLowerCase())) {
                if ((this.routeUrl.split('stage-fm.bizdevworks')[0]) === '') {
                    console.log('In home page ---- stage admin');
                    this.setSystemAdminDetails();
                } else {
                    // this.routeUrl = this.routeUrl.split('.stage-fm.bizdevworks')[0];
                    console.log('this is the route url in stage', this.routeUrl);
                    this.getCityDetails(this.routeUrl.split('.stage-fm.bizdevworks')[0]);
                }
            }

        // //Start watching for user inactivity.
        // this.userIdle.startWatching();
        //
        // // Start watching when user idle is starting.
        // this.userIdle.onTimerStart().subscribe(count => console.log(count));
        //
        // // Start watch when time is up.
        // this.userIdle.onTimeout().subscribe(() =>
        //     this.router.navigate(['/admin/logout']));
        //     // console.log('Time is up!'));
        $(document).on('click', '.container-fluid', function () {
            console.log('body click fired')
            let menuBox = document.getElementById('menu-box');
            if (menuBox.style.display === 'block') {
                menuBox.style.display = 'none';
            }
        });
    }

    // stop() {
    //     this.userIdle.stopTimer();
    // }
    //
    // stopWatching() {
    //     this.userIdle.stopWatching();
    // }
    //
    // startWatching() {
    //     this.userIdle.startWatching();
    // }
    //
    // restart() {
    //     this.userIdle.resetTimer();
    // }

    getCityDetails(params) {
        this.citiesService.getCityDetails(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this.router.navigate(['/home/land']);
                } else {
                    console.log('This is the response from getCity Details by domain', response.body);
                    sessionStorage.setItem('cityName', response.body[0]['City_Name']);
                    sessionStorage.setItem('location', response.body[0]['City'] + ', ' + response.body[0]['State']);
                    sessionStorage.setItem('address', response.body[0]['Street'] +', '+ response.body[0]['City'] +', \n'+ response.body[0]['State'] +', \n'+ response.body[0]['Zip_Code']);
                    sessionStorage.setItem('website', response.body[0]['Website']);
                    sessionStorage.setItem('cityId', response.body[0]['City_Id']);
                    sessionStorage.setItem('cityDomain', params);
                    if (this.routeUrl.toLowerCase().includes('checkstatus')) {
                        console.log('route url has check status');
                    } else {
                        if (localStorage.getItem('CognitoIdentityServiceProvider.3dq6usua5s3v79vg9sk03vo3fu.rohitk.accessToken') === null) {
                            this.router.navigate(['/home/land']);
                        } else {
                            this.router.navigate(['/home/login']);
                        }
                    }
                }
            }
        },
            err => {
                this.errorHandle(err)
            });
    }

    setSystemAdminDetails() {

        sessionStorage.setItem('cityName', 'BizCloud Experts');
        sessionStorage.setItem('address', '417 Oakbend Drive, #180, Lewisville, Texas - 75067');
        sessionStorage.setItem('website', 'www.bizcloudexperts.com');
        sessionStorage.setItem('cityId', 'System');
        if (this.routeUrl.toLowerCase().includes('checkstatus')) {
            this.router.navigate(['/home/checkStatus']);
        } else if (this.routeUrl.toLowerCase().includes('login')) {
            this.router.navigate(['/home/login']);
        } else {
        this.router.navigate(['/home']); }
    }
    isLoggedIn(message: string, isLoggedIn: boolean) {
        console.log('AppComponent: the user is authenticated: ' + isLoggedIn);
        // if (isLoggedIn) {
        // this.startWatching();
        // console.log('Starting watch');
        // } else {
        // this.stopWatching();
        // console.log('Stopping watch');
        // }
        let mythis = this;
        this.cognito.getIdToken({
            callback() {

            },
            callbackWithParam(token: any) {
                // Include the passed-in callback here as well so that it's executed downstream
                console.log('AppComponent: calling initAwsService in callback')
                mythis.awsUtil.initAwsService(null, isLoggedIn, token);
            }
        });
    }
    errorHandle(err) {
        if (err.status === 401) {
            // this.loadingBar = false;
            // this.unauthorized = true;
            this.router.navigate(['/admin/unauthorized']);
        } else if (err.status === 400 || err.status === 404 || err.status === 500) {
            // this.loadingBar = false;
            // this.error = true;
            this.router.navigate(['/admin/error']);
        } else {
            // this.loadingBar = false;
            // this.error = true;
            this.router.navigate(['/admin/error']);
        }
    }
}
