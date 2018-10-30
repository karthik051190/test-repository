import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { UserLoginService } from "../../service/user-login.service";
// import {Callback, CognitoUtil, LoggedInCallback} from "../../service/cognito.service";
// import {UserParametersService} from "../../service/user-parameters.service";
import { Router } from '@angular/router';
// import {GroundServiceService} from '../services/ground-service.service';
// import {User} from '../models/user';
import { ParksService } from '../../service/parks.service';
import { User } from '../../models/user';
import { CognitoUtil } from '../../service/cognito.service';
import { Sport } from '../../models/sport';
import { MessageService } from 'primeng/components/common/messageservice';


@Component({
    selector: 'app-parkDefaults',
    templateUrl: './parkDefaults.html',
    styleUrls: ['../../../assets/slotsAssets/css/style.css']
})
export class ParkDefaultsComponent implements OnInit {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    // public parameters: Array<Parameters> = [];
    // public cognitoId: String;
    loadingBar = false;
    unauthorized = false;
    error = false;
    cityName: string;
    address: string;
    website: string;
    parkNames = [];
    adminParkId: any;
    adminParkName: any;
    defaultSet: any;
    noParks: boolean
    constructor(public router: Router,
        public userService: UserLoginService,
        public parksService: ParksService,
        // public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil,
        private messageService: MessageService) {
        this.userService.isAuthenticated(this);
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
        console.log("In ParkDefaultsComponent");
        this.noParks = false;
    }
    ngOnInit() {
        // this.adminData = new User();
        this.parkNames = [];
        this.getParks();
        this.onParkSelected();
        console.log('parkId is: ', this.adminParkId);
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else if (isLoggedIn && localStorage.getItem('defaultParkId') !== null
            && localStorage.getItem('defaultParkId') !== 'undefined') {
            this.router.navigate(['/admin']);
        }
        // else {
        //     this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil));
        // }
    }

    onParkSelected() {
        console.log('on park select method', this.adminParkId);
        this.parkNames.forEach((e) => {
            if (e.value === this.adminParkId) {
                this.adminParkName = e.label;
            }
        });
        console.log('on park select method name:', this.adminParkName);
        localStorage.setItem('defaultParkName', this.adminParkName);
        localStorage.setItem('defaultParkId', this.adminParkId);

    }
    errorHandle(err) {
        if (err.status === 401) {
            this.loadingBar = false;
            this.unauthorized = true;
            // this.router.navigate(['/admin/unauthorized']);
        } else if (err.status === 400 || err.status === 404 || err.status === 500) {
            this.loadingBar = false;
            this.error = true;
            // this.router.navigate(['/admin/error']);
        } else {
            this.loadingBar = false;
            this.error = true;
            // this.router.navigate(['/admin/error']);
        }
    }
    getParks() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        this.parkNames = [];
        const params = {
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };

        this.parksService.getParksListDefaults(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.length === 0) {
                    localStorage.setItem('defaultParkId', 'temp');
                    this.router.navigate(['/admin/parks']);
                    this.noParks = true;
                    this.loadingBar = false;
                } else {
                    console.log('Get Parks data is: ', response.body);
                    response.body.forEach((e) => {
                        const temp = {};
                        temp['value'] = e.Park_Id;
                        temp['label'] = e.Park_Name;
                        this.parkNames.push(temp);
                    });
                    this.loadingBar = false;
                    console.log('parksList data is: ', this.parkNames);
                }
            }
        },
            err => { this.errorHandle(err) });
    }
    updateDefaults() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('defualt value is: ', this.defaultSet);
        if (this.defaultSet) {
            const params = {
                // 'category': 'updateDefaults',
                'parkId': this.adminParkId,
                'cityId': sessionStorage.getItem('cityId'),
                'repId': localStorage.getItem('repId'),
                'authorizationToken': sessionStorage.getItem('authorizationToken')
            };
            console.log('Params are: ', params);
            this.parksService.updateDefaults(params).subscribe(response => {
                console.log('The response is', response);
                if (response.body.hasOwnProperty('affectedRows')) {
                    // alert('this has own property');
                    this.loadingBar = false;
                    this.router.navigate(['/admin']);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Park Defaults Update', detail: 'Error updating defaults setting' });
                    this.loadingBar = false;
                    this.router.navigate(['/admin']);
                }
            }, err => { this.errorHandle(err) });
        } else {
            this.loadingBar = false;
            this.router.navigate(['/admin']);
        }
    }

    // userLogout() {
    //     this.loginService.userLogout();
    // }

}

// export class Parameters {
//     name: string;
//     value: string;
// }

// export class GetParametersCallback implements Callback {
//
//     constructor(public me: ParkDefaultsComponent, public cognitoUtil: CognitoUtil) {
//
//     }
//
//     callback() {
//
//     }
//
//     callbackWithParam(result: any) {
//
//         for (let i = 0; i < result.length; i++) {
//             let parameter = new Parameters();
//             parameter.name = result[i].getName();
//             parameter.value = result[i].getValue();
//             this.me.parameters.push(parameter);
//         }
//         let param = new Parameters()
//         param.name = "cognito ID";
//         param.value = this.cognitoUtil.getCognitoIdentity();
//         this.me.parameters.push(param)
//     }
// }
