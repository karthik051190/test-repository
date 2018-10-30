import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserParametersService } from '../../service/user-parameters.service';
import { Callback, CognitoUtil } from '../../service/cognito.service';
import { CityRequestsService } from '../../service/city-requests.service';
import { UserLoginService } from '../../service/user-login.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'app-city-requests',
    templateUrl: './city-requests.component.html',
    styleUrls: ['./city-requests.component.css']
})
export class CityRequestsComponent implements OnInit {
    public parameters: Array<Parameters> = [];
    cityRequests = [];
    noRequests = false;
    unauthorized = false;
    loadingBar = false;
    error = false;
    constructor(public router: Router,
        public userParams: UserParametersService,
        public userService: UserLoginService,
        public cognitoUtil: CognitoUtil,
        public cityrequestsservice: CityRequestsService,
        private messageService: MessageService) { }

    ngOnInit() {
        this.cityRequests = [];
        this.getCityRequests();
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
    getCityRequests() {
        this.loadingBar = true;
        this.cityRequests = [];
        this.cityrequestsservice.getCityRequests().subscribe(response => {
            console.log('The response is', response);
            if (response.body.length === 0) {
                this.noRequests = true;
                this.loadingBar = false;
                console.log('No requests are there');
            } else {
                console.log('Requests data:', response.body);
                response.body.forEach(element => {
                    let temp = [];
                    temp['cityId'] = element['City_Id'];
                    temp['cityName'] = element['City_Name'];
                    temp['street'] = element['Street'];
                    temp['city'] = element['City'];
                    temp['state'] = element['State'];
                    temp['zipCode'] = element['Zip_Code'];
                    // temp['address'] = element['Address'];
                    // temp['website'] = element['Website'];
                    temp['domain'] = element['Domain'];
                    temp['cityStatus'] = element['City_Status'];
                    this.cityRequests.push(temp);
                });
                this.loadingBar = false;
                console.log('returnsList:', this.cityRequests);
            }
        }, err => { this.errorHandle(err) });
    }

    acceptRequest(cityId) {
        this.loadingBar = true;
        const params = {
            'cityId': cityId,
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.cityrequestsservice.acceptRequest(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.getCityRequests();
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Cities Update', detail: 'City request approved successfully' });
            } else if (response.status === 201) {
                this.getCityRequests();
                this.loadingBar = false;
                this.messageService.add({ severity: 'warn', summary: 'Cities Update', detail: 'Request approved, but unable to send notification!' });
            }
        }, err => { this.errorHandle(err) });
    }

    declineRequest(cityId) {
        this.loadingBar = true;
        const params = {
            'cityId': cityId,
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.cityrequestsservice.declineRequest(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.getCityRequests();
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Cities Update', detail: 'City request declined' });
            } else if (response.status === 201) {
                this.getCityRequests();
                this.loadingBar = false;
                this.messageService.add({ severity: 'warn', summary: 'Cities Update', detail: 'Request declined, but unable to send notification!' });
            }
        }, err => { this.errorHandle(err) });
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil));
        }
    }
}

export class Parameters {
    name: string;
    value: string;
}

export class GetParametersCallback implements Callback {

    constructor(public me: CityRequestsComponent, public cognitoUtil: CognitoUtil) {

    }

    callback() {

    }

    callbackWithParam(result: any) {

        for (let i = 0; i < result.length; i++) {
            let parameter = new Parameters();
            parameter.name = result[i].getName();
            parameter.value = result[i].getValue();
            this.me.parameters.push(parameter);
        }
        let param = new Parameters()
        param.name = 'cognito ID';
        param.value = this.cognitoUtil.getCognitoIdentity();
        this.me.parameters.push(param)
    }
}
