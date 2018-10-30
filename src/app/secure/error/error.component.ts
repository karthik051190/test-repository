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



@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    // styleUrls: ['./parks.component.css']
})
export class ErrorComponent implements LoggedInCallback, OnInit {

    public parameters: Array<Parameters> = [];
    addParkDialog = false;
    editParkDialog = false;
    loadingBar = false;
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
        public confirmationService: ConfirmationService) {
        this.userService.isAuthenticated(this);
        console.log('In ErrorComponent');
    }


    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil));
        }
    }

    ngOnInit() { }
}

export class Parameters {
    name: string;
    value: string;
}

export class GetParametersCallback implements Callback {

    constructor(public me: ErrorComponent, public cognitoUtil: CognitoUtil) {

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