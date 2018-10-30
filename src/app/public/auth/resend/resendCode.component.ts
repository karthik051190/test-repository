import { environment } from './../../../../environments/environment';
import { Component } from "@angular/core";
import { UserRegistrationService } from "../../../service/user-registration.service";
import { CognitoCallback } from "../../../service/cognito.service";
import { Router } from "@angular/router";
@Component({
    selector: 'app-resendCode',
    templateUrl: './resendCode.html',
    styleUrls: ['../../../../assets/slotsAssets/css/style.css']

})
export class ResendCodeComponent implements CognitoCallback {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    email: string;
    errorMessage: string;

    constructor(public registrationService: UserRegistrationService, public router: Router) {

    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
    resendCode() {
        this.registrationService.resendCode(this.email, this);
    }

    cognitoCallback(error: any, result: any) {
        if (error != null) {
            this.errorMessage = "Something went wrong...please try again";
        } else {
            this.router.navigate(['/home/accountActivation', this.email]);
        }
    }
}