import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../../service/user-login.service';
import { Callback, CognitoUtil, LoggedInCallback } from '../../service/cognito.service';
import { UserParametersService } from '../../service/user-parameters.service';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder, AsyncValidator } from '@angular/forms';
import { User } from '../../models/user';
import { ConfirmationService } from 'primeng/api';
import { Rep } from '../../models/rep';
import { AdminsService } from '../../service/admins.service';
import { MessageService } from 'primeng/components/common/messageservice';


@Component({
    selector: 'app-admins',
    templateUrl: './admins.html',
    styleUrls: ['../../../assets/slotsAssets/css/style.css']
})
export class AdminsComponent implements LoggedInCallback, OnInit {
    loadingBar = false;
    unauthorized = false;
    error = false;
    usernameAvailability = false;
    adminform: FormGroup;
    addAdminDialog = false;
    editAdminDialog = false;
    adminData = new Rep();
    permission = [];
    existingPermission: string;
    adminList = [];
    public parameters: Array<Parameters> = [];

    constructor(public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public adminsservice: AdminsService,
        public cognitoUtil: CognitoUtil,
        private formbuilder: FormBuilder,
        public confirmationService: ConfirmationService,
        private messageService: MessageService) {
        this.userService.isAuthenticated(this);
        this.adminData = new Rep();
        console.log('In AdminsComponent');
    }
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            console.log('**** not logged in');
            this.router.navigate(['/home/login']);
        } else {
            console.log('**** logged in');
            this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil));
        }
    }
    ngOnInit() {
        this.permission.push({ label: 'Read Only', value: 'ReadOnly' });
        this.permission.push({ label: 'Slots Admin', value: 'GroundAdmin' });
        this.permission.push({ label: 'City Admin', value: 'CityAdmin' });
        // this.permission.push({label: 'System Admin', value: 'SystemAdmin'});
        this.adminform = this.formbuilder.group({
            'firstName': new FormControl('', Validators.required),
            'lastName': new FormControl('', Validators.required),
            'email': new FormControl('', Validators.required),
            'username': new FormControl('', Validators.required),
            'permission': new FormControl('', Validators.required),
            'phoneNumber': new FormControl('', Validators.required)
        });
        this.adminList = [];
        this.getAdminList();
    }
    errorHandle(err) {
        if (err.status === 401) {
            this.loadingBar = false;
            this.unauthorized = true;
            this.editAdminCancel();
            this.addAdminCancel();
            // this.router.navigate(['/admin/unauthorized']);
        } else if (err.status === 400 || err.status === 404 || err.status === 500) {
            this.loadingBar = false;
            this.error = true;
            this.editAdminCancel();
            this.addAdminCancel();
            // this.router.navigate(['/admin/error']);
        } else {
            this.loadingBar = false;
            this.error = true;
            this.editAdminCancel();
            this.addAdminCancel();
            // this.router.navigate(['/admin/error']);
        }
    }
    getAdminList() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        this.adminList = [];
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'cityId': sessionStorage.getItem('cityId')
        };
        console.log('params', params);
        this.adminsservice.getAdmins(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this.loadingBar = false;
                    this.messageService.add({ severity: 'info', summary: 'Admins Update', detail: 'No admins exist' });
                } else {
                    response.body.userList.forEach(each => {
                        const temp = {};
                        // temp['cityId'] = each.City_Id;
                        temp['firstName'] = each.First_Name;
                        temp['lastName'] = each.Last_Name;
                        temp['email'] = each.Email;
                        temp['phone'] = each.Phone_Number;
                        temp['userName'] = each.Username;
                        temp['repId'] = each.Rep_Id;
                        // temp['repStatus'] = each.Rep_Status;
                        this.permission.forEach(e => {
                            if (each.permission === e.value) {
                                temp['permission'] = e.label;
                                temp['permission_value'] = e.value;
                            }
                        });
                        this.adminList.push(temp);
                    });
                    this.loadingBar = false;
                    console.log('adminList', this.adminList);
                }
            }
        },
            err => { this.errorHandle(err) });
    }
    checkUsername(dataIn) {
        if (dataIn !== '' && dataIn !== undefined) {
            this.loadingBar = true;
            this.cognitoUtil.refresh();
            const params = {
                'authorizationToken': sessionStorage.getItem('authorizationToken'),
                'cityId': sessionStorage.getItem('cityId'),
                'username': dataIn
            };
            console.log('params', params);
            this.adminsservice.checkUsername(params).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    this.loadingBar = false;
                    this.usernameAvailability = false;
                } else if (response.status === 201) {
                    this.loadingBar = false;
                    this.usernameAvailability = true;
                }
            },
                err => {
                    this.errorHandle(err)
                });
        }
    }
    addAdmin() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('This is the form input data', this.adminData);
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'cityId': sessionStorage.getItem('cityId')
        };
        this.adminsservice.addAdmin(this.adminData, params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                // this.addAdminDialog = false;
                this.addAdminCancel();
                this.loadingBar = false;
                this.adminData = new Rep();
                this.getAdminList();
                this.messageService.add({ severity: 'success', summary: 'Admins Update', detail: 'Admin added successfully' });
            } else if (response.status === 201) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'error', summary: 'Admins Update', detail: 'Username is not available' });
            }
        },
            err => {
                this.errorHandle(err)
            });
    }
    onClickEditAdmin(inputParams) {
        let element = document.getElementById('edit-admin');
        element.classList.add('park_modal_bg');
        this.editAdminDialog = true;
        this.adminData.firstName = inputParams.firstName;
        this.adminData.lastName = inputParams.lastName;
        this.adminData.email = inputParams.email;
        this.adminData.username = inputParams.userName;
        this.adminData.phoneNumber = inputParams.phone;
        this.adminData.permission = inputParams.permission_value;
        this.existingPermission = inputParams.permission_value;
        console.log('this is the selected admin data in .ts file', this.adminData);
    }
    confirmDelete(selectedAdminRow) {
        console.log('in confirmation service popup method', selectedAdminRow);
        this.confirmationService.confirm({
            message: 'Are you sure?',
            header: 'Delete Admin',
            // icon: 'fa fa-question-circle',
            accept: () => {
                this.deleteAdmin(selectedAdminRow);
            },
            reject: () => {
            }
        })
    }
    deleteAdmin(inputParams) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        const outputParams = {
            'username': inputParams.userName,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        console.log('params', outputParams);
        this.adminsservice.deleteAdmin(outputParams).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Admins Update', detail: 'Admin deleted successfully' });
                this.getAdminList();
            }
        }, err => { this.errorHandle(err) });
    }
    editAdminCancel() {
        let element = document.getElementById('edit-admin');
        element.classList.remove('park_modal_bg');
        this.editAdminDialog = false;
        this.adminform.reset();
    }
    editAdmin() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        if (this.existingPermission === '') {
            this.existingPermission = ' ';
        }
        const params = {
            'firstName': this.adminData.firstName,
            'lastName': this.adminData.lastName,
            'username': this.adminData.username,
            'email': this.adminData.email,
            'phoneNumber': this.adminData.phoneNumber,
            'existingPermission': this.existingPermission,
            'newPermission': this.adminData.permission,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        console.log('This is the edit form input data', params);
        this.adminsservice.editAdmin(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                // this.editAdminDialog = false;
                this.editAdminCancel();
                this.messageService.add({ severity: 'success', summary: 'Admins Update', detail: 'Admin edited successfully' });
                this.adminData = new Rep();
                this.getAdminList();
            }
        }, err => { this.errorHandle(err) });
    }
    addAdminCancel() {
        let element = document.getElementById('add-admin');
        element.classList.remove('park_modal_bg');
        this.addAdminDialog = false;
        this.adminform.reset();
        this.usernameAvailability = false;
    }
    onClickAddAdmin() {
        let element = document.getElementById('add-admin');
        element.classList.add('park_modal_bg');
        console.log('this is clicked select add admin', this.addAdminDialog);
        this.addAdminDialog = true;
    }
}
export class Parameters {
    name: string;
    value: string;
}
export class GetParametersCallback implements Callback {
    constructor(public me: AdminsComponent, public cognitoUtil: CognitoUtil) { }
    callback() { }
    callbackWithParam(result: any) {
        for (let i = 0; i < result.length; i++) {
            let parameter = new Parameters();
            parameter.name = result[i].getName();
            parameter.value = result[i].getValue();
            this.me.parameters.push(parameter);
        }
        let param = new Parameters();
        param.name = 'cognito ID';
        param.value = this.cognitoUtil.getCognitoIdentity();
        this.me.parameters.push(param)
    }
}
