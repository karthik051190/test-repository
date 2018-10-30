import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../../service/user-login.service';
import { Callback, CognitoUtil, LoggedInCallback } from '../../service/cognito.service';
import { UserParametersService } from '../../service/user-parameters.service';
import { Router } from '@angular/router';
import { ParkModel } from '../../models/park';
import { ParksService } from '../../service/parks.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';



@Component({
    selector: 'app-parks',
    templateUrl: './parks.component.html',
    // styleUrls: ['./parks.component.css']
})
export class ParksComponent implements LoggedInCallback, OnInit {
    public parameters: Array<Parameters> = [];
    addParkDialog = false;
    editParkDialog = false;
    loadingBar = false;
    unauthorized = false;
    error = false;
    parkData = new ParkModel();
    parkform: FormGroup;
    noParks: boolean;
    parksList = [];

    constructor(public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil,
        public parksservice: ParksService,
        private formbuilder: FormBuilder,
        public confirmationService: ConfirmationService,
        private messageService: MessageService) {
        this.userService.isAuthenticated(this);
        this.noParks = false;
        console.log('In ParksComponent');
    }


    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil));
        }
    }

    ngOnInit() {
        this.parksList = [];
        this.getParks();
        this.parkform = this.formbuilder.group({
            'parkName': new FormControl('', Validators.required),
            'parkAddress': new FormControl('', Validators.required),
            'parkWebsite': new FormControl('', Validators.required)
        });
    }
    getParks() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        this.parksList = [];
        const params = {
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.parksservice.getParks(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this.noParks = true;
                    this.loadingBar = false;
                    if (localStorage.getItem('defaultParkId') === 'temp') {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Please add a new park',
                            detail: ''
                        });
                    } else {
                        localStorage.removeItem('defaultParkId');
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Parks Update',
                            detail: 'No parks exist'
                        });
                    }
                } else {
                    this.noParks = false;
                    console.log('get parks data', response.body);
                    response.body.forEach((o) => {
                        const temp = {};
                        temp['parkId'] = o['Park_Id'];
                        temp['parkname'] = o['Park_Name'];
                        temp['address'] = o['Address'];
                        temp['website'] = o['Website'];
                        temp['cityId'] = o['City_Id'];
                        temp['parkStatus'] = o['Park_Status'];
                        this.parksList.push(temp);
                    });
                    this.loadingBar = false;
                    console.log('parksList', this.parksList);
                }
            }
        },
            err => {
                this.errorHandle(err)
            });
    }
    confirmDelete(selectedParkRow) {
        console.log('in confirmation service popup method', selectedParkRow);
        this.confirmationService.confirm({
            message: 'Deleting a park will delete all associated grounds, reservations, schedules and slots. \n Are you sure?',
            header: 'Delete Park',
            // icon: 'fa fa-question-circle',
            accept: () => {
                this.deletePark(selectedParkRow);
            },
            reject: () => { }
        })
    }
    deletePark(inputParams) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        const outputParams = {
            'parkId': inputParams.parkId,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        console.log('params', outputParams);
        this.parksservice.deletePark(outputParams).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                // if (response.body.hasOwnProperty('affectedRows')) {
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Parks Update',
                    detail: 'Park deleted successfully'
                });
                this.getParks();
                // }
            } else if (response.status === 201) {
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Parks Update',
                    detail: 'Park deleted, Error deleting all associated entities'
                });
                this.getParks();
            }
        }, err => {
            this.errorHandle(err)
        });
    }
    onClickEditPark(inputParams) {
        let element = document.getElementById('edit-park');
        element.classList.add('park_modal_bg');
        this.editParkDialog = true;
        this.parkData.parkName = inputParams.parkname;
        this.parkData.address = inputParams.address;
        this.parkData.website = inputParams.website;
        this.parkData.parkId = inputParams.parkId;
        console.log('this is the selected park data in ts file', this.parkData);
    }
    onClickAddPark() {
        let element = document.getElementById('add-park');
        element.classList.add('park_modal_bg');
        this.addParkDialog = true;
    }

    addPark() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('These are the new park params', this.parkData);
        let params = {
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.parksservice.addPark(this.parkData, params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (localStorage.getItem('defaultParkId') === 'temp') {
                    localStorage.setItem('defaultParkId', response.body['insertId']);
                    localStorage.setItem('defaultParkName', this.parkData.parkName);
                }
                this.loadingBar = false;
                this.parkform.reset();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Parks Update',
                    detail: 'Park added successfully'
                });
                this.getParks();
                this.cancelAddPark();
            }
        }, err => {
            this.errorHandle(err)
        });
    }
    cancelAddPark() {
        let element = document.getElementById('add-park');
        element.classList.remove('park_modal_bg');

        this.addParkDialog = false;
        this.parkform.reset();
    }
    editPark() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('These are the edit park params', this.parkData);
        let params = {
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.parksservice.editPark(this.parkData, params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.hasOwnProperty('affectedRows')) {
                    this.loadingBar = false;
                    this.parkform.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Parks Update',
                        detail: 'Park edited successfully'
                    });
                    this.getParks();
                    this.cancelEditPark();
                }
            }
        }, err => {
            this.errorHandle(err)
        });
    }
    cancelEditPark() {
        let element = document.getElementById('edit-park');
        element.classList.remove('park_modal_bg');
        this.editParkDialog = false;
        this.parkform.reset();
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

}

export class Parameters {
    name: string;
    value: string;
}

export class GetParametersCallback implements Callback {

    constructor(public me: ParksComponent, public cognitoUtil: CognitoUtil) {

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
