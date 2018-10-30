import { Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class UserLoginService {
    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {
        console.log('In authenticateUser onSuccess callback');
        console.log('token: ', session.getIdToken().getJwtToken());
        sessionStorage.setItem('authorizationToken', session.getIdToken().getJwtToken());
        console.log('in load grounds service call');
        // this.getUserDetails().subscribe( data => {
        //     console.log('this is the output form get user details:', data); });
        // sessionStorage.setItem('TIMER', JSON.stringify(moment.now())); // added timer for session timeout
        let tokenInfo = this.getDecodedAccessToken(session.getIdToken().getJwtToken());
        let expireDate = tokenInfo.exp;
        console.log('token expire: ', expireDate);
        console.log('token info: ', tokenInfo);
        // this.userIdle.startWatching();
        AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken());

        // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
        // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
        // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
        // security credentials. The identity is then injected directly into the credentials object.
        // If the first SDK call we make wants to use our IdentityID, we have a
        // chicken and egg problem on our hands. We resolve this problem by 'priming' the AWS SDK by calling a
        // very innocuous API call that forces this behavior.
        // comment added
        // let clientParams: any = {};
        // if (environment.sts_endpoint) {
        //     clientParams.endpoint = environment.sts_endpoint;
        // }
        // let sts = new STS(clientParams);
        // sts.getCallerIdentity(function (err, data) {
        console.log('UserLoginService: Successfully set the AWS credentials');
        callback.cognitoCallback(null, session); // uncommented for routing on login
        // });
    };
    private onLoginError = (callback: CognitoCallback, err) => {
        callback.cognitoCallback(err.message, null);
    };
    getUserDetails(data): Observable<any> {
        let params = new HttpParams();
        params = params.append('cityId', sessionStorage.getItem('cityId'));
        console.log('Params to get user details:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/admin/detailsbytoken';
        return this.http.get(url, options);
    }
    constructor(
        // public ddb: DynamoDBService,
        // private userIdle: UserIdleService,
        public http: HttpClient,
        public cognitoUtil: CognitoUtil,
        public router: Router) {
        console.log('User Login Service constructor');
    }
    authenticate(username: string, password: string, callback: CognitoCallback) {
        console.log('UserLoginService: starting the authentication');
        let authenticationData = {
            Username: username,
            Password: password,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };
        console.log('UserLoginService: Params set...Authenticating the user');
        let cognitoUser = new CognitoUser(userData);
        console.log('UserLoginService: config is ' + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: err => this.onLoginError(callback, err),
            mfaRequired: (challengeName, challengeParameters) => {
                callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                    cognitoUser.sendMFACode(confirmationCode, {
                        onSuccess: result => this.onLoginSuccess(callback, result),
                        onFailure: err => this.onLoginError(callback, err)
                    });
                });
            }
        });
    }
    forgotPassword(username: string, callback: CognitoCallback) {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };
        let cognitoUser = new CognitoUser(userData);
        cognitoUser.forgotPassword({
            onSuccess: function () {

            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback(null, null);
            }
        });
    }
    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        let userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };
        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function () {
                callback.cognitoCallback(null, null);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }
    logout() {
        console.log('UserLoginService: Logging out');
        localStorage.removeItem('defaultParkName');
        localStorage.removeItem('defaultParkId');
        sessionStorage.removeItem('authorizationToken');
        localStorage.removeItem('repId');
        localStorage.removeItem('repInitials');
        localStorage.removeItem('repName');
        localStorage.removeItem('superAdmin');
        this.cognitoUtil.getCurrentUser().signOut();

    }
    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null) {
            throw ('UserLoginService: Callback in isAuthenticated() cannot be null');
        }
        let cognitoUser = this.cognitoUtil.getCurrentUser();
        if (cognitoUser != null) {
            console.log('It is here check 1');
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log('It is here check 2');
                    console.log('UserLoginService: Could not get the session: ' + err, err.stack);
                    callback.isLoggedIn(err, false);
                } else {
                    console.log('UserLoginService: Session is ' + session.isValid());
                    sessionStorage.setItem('authorizationToken', session.getIdToken().getJwtToken());
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            console.log('UserLoginService: can not retrieve the current user');
            // this.router.navigate(['/home/land']);
            callback.isLoggedIn('Can not retrieve the CurrentUser', false);
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
}
