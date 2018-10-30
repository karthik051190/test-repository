import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from './service/user-login.service';
import { CognitoUtil, LoggedInCallback } from './service/cognito.service';

@Component({
    selector: 'app-admin',
    templateUrl: './secure/landing/admin.html',
    // styleUrls: ['../assets/slotsAssets/css/style.css']
})
// export class SecureComponent implements OnInit, LoggedInCallback {
export class AdminComponent implements OnInit, LoggedInCallback {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    cityName: string;
    state: string;
    address: string;
    website: string;
    logoName: string;

    userData: any;
    repInitials: any;
    applicant: any = {};
    constructor(public router: Router, public userService: UserLoginService,
        public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
        console.log("AdminComponent: constructor");
    }

    ngOnInit() {
        // {"value": "1", "label": "Rk"}
        this.userData = [
            { "value": "1", "label": localStorage.getItem('repName') },
            { "value": "2", "label": "Switch Park" },
            { "value": "3", "label": "Logout" },]
        this.repInitials = localStorage.getItem('repInitials');
        this.applicant = { "value": "4", "label": this.repInitials }
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else if (isLoggedIn && (localStorage.getItem('defaultParkId') === null ||
            localStorage.getItem('defaultParkId') === 'undefined') && localStorage.getItem('superAdmin') !== 'true') {
            console.log('it is here');
            this.router.navigate(['/parkDefaults']);
        } else if (isLoggedIn && localStorage.getItem('superAdmin') === 'true') {
            this.router.navigate(['/admin/cityRequests']);
        } else if (isLoggedIn && localStorage.getItem('superAdmin') !== 'true' && localStorage.getItem('defaultParkId') === 'temp') {
            this.router.navigate(['/admin/parks']);
        } else { this.router.navigate(['/admin']); }

    }

    toggleMenu() {
        console.log('clicked');
        var menuBox = document.getElementById('menu-box');
        if (menuBox.style.display === "block") {
            menuBox.style.display = "none";
        } else {
            menuBox.style.display = "block";
        }
    }

    gotoPage(params) {
        console.log("params", params)
        if (params === '3') {
            this.router.navigate(['/admin/logout']);
        }
        if (params === '2') {
            this.cognitoUtil.refresh();
            localStorage.removeItem('defaultParkId');
            localStorage.removeItem('defaultParkName');
            this.router.navigate(['/parkDefaults']);
        }
    }
}

