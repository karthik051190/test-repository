import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../../service/user-login.service';
import { Callback, CognitoUtil, LoggedInCallback } from '../../service/cognito.service';
import { UserParametersService } from '../../service/user-parameters.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { GroundsSports } from '../../models/grounds-sports';
import { GroundsService } from '../../service/grounds.service';
import { ConfirmationService } from 'primeng/api';
import { Validators, FormControl, FormGroup, FormBuilder, AsyncValidator } from '@angular/forms';
import { Ground } from '../../models/ground';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AuthenticationDetails, CognitoUser, CognitoUserSession, ICognitoUserSessionData } from 'amazon-cognito-identity-js';
import { Sport } from '../../models/sport';
import { CheckboxModule } from 'primeng/checkbox';
import { AccessTokenCallback } from '../slots/slots.component';
import { MessageService } from 'primeng/components/common/messageservice';


@Component({
    selector: 'app-grounds',
    templateUrl: './grounds.html'
})
export class GroundsComponent implements LoggedInCallback, OnInit {
    groundform: FormGroup;
    loadingBar = false;
    public parameters: Array<Parameters> = [];
    public cognitoId: String;
    public allGrounds: GroundsSports[] = [];
    public allSports: Sport[] = [];
    public grounds1 = [];
    public sportsForGround = [];
    selectedPark: any;
    unauthorized = false;
    error = false;
    createNewSport = new Sport();
    addGroundDialog = false;
    sportsExist = false;
    moreSportsExist = false;
    groundData = new Ground();
    filteredSportsSingle: any[];
    sport: any;
    sports: any[];
    selectedSportArray: Sport[];
    edit_groundName;
    edit_groundId;
    edit_sportName = [];
    other_sportName: any;
    newSport;
    availableSports = [];
    isNewSport = false;
    isAddSport = false;
    isNotOthers = true;
    isNotNewOther = true;
    viewSport = false;
    showEditGround = false;
    showSports = true;
    hideSports = false;
    // cognito = new UserLoginService(this.http);
    // selectedSport = {};


    constructor(
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public groundsservice: GroundsService,
        private formbuilder: FormBuilder,
        public confirmationservice: ConfirmationService,
        public cognitoUtil: CognitoUtil,
        private messageService: MessageService) {
        // this.cognitoUtil.refresh();
        this.userService.isAuthenticated(this);
        this.selectedSportArray = [];
    }

    private newMethod(): any {
        return 'In GroundsComponent';
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil));
        }
    }

    ngOnInit() {
        this.cognitoUtil.refresh();
        this.loadGrounds();
        this.getSports();
        this.selectedPark = localStorage.getItem('defaultParkName');
        console.log('selected Park is:', this.selectedPark);
        this.groundform = this.formbuilder.group({
            'groundName': new FormControl('', Validators.required),
            'sportName': new FormControl('', Validators.required),
            'selectedSport': new FormControl('')
            // 'email': new FormControl('', Validators.required),
            // 'username': new FormControl('', Validators.required),
            // 'permission': new FormControl('', Validators.required),
            // 'phoneNumber': new FormControl('',  Validators.required)
        });
    }
    onClickEditGround(ground) {
        this.showEditGround = true;
        $('.edit_ground1').attr('disabled', 'disabled');
        this.edit_groundName = ground.groundName;
        this.edit_groundId = ground.groundId;
        // $('.edit_ground1').removeAttr('disabled');
        if (ground.moreSports !== undefined) {
            this.edit_sportName = (ground.sport).concat(ground.moreSports);
        } else {
            this.edit_sportName = ground.sport;
        }
        console.log('this is the edit_sportname', this.edit_sportName);
    }

    addNewSport(sports) {
        this.selectedSportArray = [];
        this.availableSports = [];
        this.showEditGround = false;
        // document.getElementById('editGroundClose').click();
        $('.modal-backdrop').hide();
        $('.edit_ground2').attr('disabled', 'disabled');
        this.newSport = true;
        console.log('existing sports ', sports)
        console.log('available sports are', this.allSports)
        var sportNames = [];
        sports.forEach(function (a) {
            sportNames.push(a.sportName);
        });
        console.log(sportNames)
        var filteredEvents = this.allSports.filter(function (event) {
            return !sportNames.includes(event.sportName)
        });
        this.availableSports = filteredEvents;
        this.viewSport = false;
        console.log('remaining sports are ', this.availableSports)
    }
    veiwSport() {
        this.viewSport = true;
        this.showSports = false;
        this.hideSports = true;
    }
    hideSport() {
        this.viewSport = false;
        this.showSports = true;
        this.hideSports = false;
    }
    cancelGround() {
        this.viewSport = false;
    }
    getSports() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        this.groundsservice.getSports().subscribe(response => {
            console.log('The response is', response);
            let tempObjArray: Sport[] = [];
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this.allSports = [];
                    this.loadingBar = false;
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Grounds Update',
                        detail: 'No sports exist'
                    });
                } else {
                    console.log('this is before data.forEach');
                    response.body.forEach((o) => {
                        console.log(o);
                        let obj = new Sport();
                        obj.sportId = o['Sport_Id'];
                        obj.sportName = o['Sport_Name'];
                        obj.checked = false;
                        tempObjArray.push(obj);
                        console.log('this is the temp obj ', tempObjArray);
                    });
                    this.allSports = tempObjArray;
                    this.loadingBar = false;
                }
            }
        },
            err => {
                this.errorHandle(err)
            });
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
    change(e, type) {
        console.log(e.target.checked);
        console.log(type);
        if (e.target.checked) {
            $('.edit_ground2').removeAttr('disabled');
            this.selectedSportArray.push(type);
            this.allSports.forEach((element) => {
                if (element.sportId === type.sportId) {
                    element.checked = true;
                }
            });
            console.log('sport array is: ', this.selectedSportArray);
        } else {
            let updateItem = this.selectedSportArray.find(this.findIndexToUpdate, type.sportName);
            this.allSports.forEach((element) => {
                if (element.sportId === type.sportId) {
                    element.checked = false;
                }
            });
            $('.edit_ground2').attr('disabled', 'disabled');
            let index = this.selectedSportArray.indexOf(updateItem);
            this.selectedSportArray.splice(index, 1);
            console.log('sport array is: ', this.selectedSportArray);
        }
    }

    findIndexToUpdate(type) {
        return type.sportName === this;
    }

    private loadGrounds() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        if (sessionStorage.getItem('authorizationToken') !== null || sessionStorage.getItem('authorizationToken') !== undefined) {
            this.allGrounds = [];
            const params = {
                'authorizationToken': sessionStorage.getItem('authorizationToken'),
                'cityId': sessionStorage.getItem('cityId'),
                'parkId': localStorage.getItem('defaultParkId')
            };
            console.log('params', params);
            this.groundsservice.getGrounds(params).subscribe(response => {
                console.log('The response is', response);
                // let tempObjArray: GroundsSports[] = [];
                if (response.status === 200) {
                    let tempObjArray: GroundsSports[] = [];
                    if (response.body.length === 0) {
                        this.loadingBar = false;
                        this.allGrounds = [];
                        this.messageService.add({
                            severity: 'info',
                            summary: 'No grounds exist',
                            detail: 'Please add a ground'
                        });
                    } else {
                        console.log('this is the response get grounds GS', response.body);
                        response.body.forEach((o) => {
                            console.log(o);
                            let obj = new GroundsSports();
                            obj.gsId = o['GS_Id'];
                            obj.groundId = o['Ground_Id'];
                            obj.sportId = o['Sport_Id'];
                            obj.sportName = o['Sport_Name'];
                            obj.groundName = o['Ground_Name'];
                            obj.gsStatus = o['GS_Status'];
                            tempObjArray.push(obj);
                            console.log('this is the temp obj ', tempObjArray);
                        });
                        this.allGrounds = tempObjArray;
                        let groundsList = {};
                        for (let i = 0; i < this.allGrounds.length; i++) {
                            let groundName = this.allGrounds[i].groundName;
                            let groundId = this.allGrounds[i].groundId;
                            if (!groundsList[groundName]) {
                                groundsList[groundName] = [];
                            }
                            if (this.allGrounds[i].gsId !== null && this.allGrounds[i].gsId !== undefined &&
                                this.allGrounds[i].gsStatus !== 'Inactive') {
                                groundsList[groundName].push({
                                    gsId: this.allGrounds[i].gsId,
                                    sportName: this.allGrounds[i].sportName,
                                    sportId: this.allGrounds[i].sportId,
                                    gsStatus: this.allGrounds[i].gsStatus,
                                    groundId: this.allGrounds[i].groundId,
                                    sportsExist: true
                                });
                            } else {
                                groundsList[groundName].push({
                                    groundId: this.allGrounds[i].groundId,
                                    sportsExist: false
                                });
                            }
                            console.log('grounds list is', groundsList);

                        }
                        this.grounds1 = [];
                        for (let groundName in groundsList) {
                            console.log('this is the groundsList[groundName]', groundsList[groundName]);
                            let gsList = [];
                            groundsList[groundName].forEach(e => {
                                if (e.sportsExist === true) {
                                    gsList.push(e);
                                }
                                console.log('this is the gsList', gsList);
                            });
                            if (gsList.length > 0 && gsList.length <= 4) {
                                this.grounds1.push({
                                    groundName: groundName,
                                    groundId: gsList[0].groundId,
                                    sportsExist: gsList[0].sportsExist,
                                    sport: gsList
                                });
                            } else if (gsList.length > 4) {
                                this.moreSportsExist = true
                                let extraSports = [];
                                for (let i = 4; i < gsList.length; i++) {
                                    extraSports.push(gsList[i]);
                                }
                                console.log('this is the extra Sports list', extraSports);
                                this.grounds1.push({
                                    groundName: groundName,
                                    groundId: gsList[0].groundId,
                                    sportsExist: gsList[0].sportsExist,
                                    sport: gsList.splice(0, 4),
                                    moreSports: extraSports,
                                    moreSportsExist: this.moreSportsExist
                                });
                            } else {
                                this.grounds1.push({
                                    groundName: groundName,
                                    groundId: groundsList[groundName][0].groundId,
                                    sportsExist: false,
                                    sport: []
                                });
                            }
                        }
                        this.loadingBar = false;
                        console.log('This is the formatted object', this.grounds1);
                    }
                }
            }, err => {
                this.errorHandle(err)
            });
        }
    }
    onClickDeleteSport(selectedSport) {
        $('.popover_close').hide();
        console.log('Delete sport popup', selectedSport);
        this.confirmationservice.confirm({
            message: 'Are you sure?',
            header: 'Delete Sport',
            accept: () => {
                this.deleteSport(selectedSport);
                $('.popover_close').show();
            },
            reject: () => {
                $('.popover_close').show();
            }
        })
    }
    deleteSport(inputParams) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        const outputParams = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'cityId': sessionStorage.getItem('cityId'),
            'gsId': inputParams.gsId
        };
        console.log('params', outputParams);
        this.groundsservice.deleteSport(outputParams).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Grounds Update',
                    detail: 'Sport deleted successfully'
                });
                this.loadGrounds();
            }
        }, err => {
            this.errorHandle(err)
        });
    }
    onClickDeleteGround(selectedGround) {
        // console.log('Delete sport popup',selectedSport);
        this.confirmationservice.confirm({
            message: 'Are you sure?',
            header: 'Delete Ground',
            accept: () => {
                this.deleteGround(selectedGround);
            },
            reject: () => { }
        })
    }
    deleteGround(inputParams) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        const outputParams = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'cityId': sessionStorage.getItem('cityId'),
            'groundId': inputParams.groundId
        };
        console.log('params', outputParams);
        this.groundsservice.deleteGround(outputParams).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.allGrounds = [];
                this.grounds1 = [];
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Grounds Update',
                    detail: 'Ground deleted successfully'
                });
                this.loadGrounds();
            }
            if (response.status === 201) {
                this.allGrounds = [];
                this.grounds1 = [];
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Grounds Update',
                    detail: 'Ground deleted successfully, error sending notification!'
                });
                this.loadGrounds();
            }
        }, err => {
            this.errorHandle(err)
        });
    }
    onClickAddGround() {
        this.selectedSportArray = [];
        console.log('this is clicked select add admin', this.addGroundDialog);
        this.addGroundDialog = true;
        console.log('this is clicked select add admin', this.addGroundDialog);
    }
    addGround() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('This is the form input data', this.groundData.groundName);
        console.log('This is the form input data for sports', this.groundData.sportName);
        this.addGroundDialog = false;
        this.isAddSport = false;
        $('.modal-backdrop').hide();
        $('.sprts_chck_box input:checkbox').removeAttr('checked');
        this.isNotNewOther = true;
        if (this.groundData.sportName === null || this.groundData.sportName === undefined) {
            const outputParams = {
                'authorizationToken': sessionStorage.getItem('authorizationToken'),
                'cityId': sessionStorage.getItem('cityId'),
                'parkId': localStorage.getItem('defaultParkId'),
                'groundName': this.groundData.groundName,
                'sport': JSON.stringify(this.selectedSportArray)
            };
            console.log('available sports', outputParams);
            this.groundform.reset();
            this.groundsservice.addGround(outputParams).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    this.loadingBar = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Grounds Update',
                        detail: 'Ground added successfully'
                    });
                    this.loadGrounds();
                }
            }, err => {
                this.errorHandle(err)
            });
            this.selectedSportArray = [];
        } else {
            const outputParams = {
                'authorizationToken': sessionStorage.getItem('authorizationToken'),
                'cityId': sessionStorage.getItem('cityId'),
                'parkId': localStorage.getItem('defaultParkId'),
                'groundName': this.groundData.groundName,
                'sport': this.groundData.sportName
            };
            console.log('Other sports', outputParams);
            this.groundform.reset();
            this.groundsservice.addGround(outputParams).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    this.loadingBar = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Grounds Update',
                        detail: 'Ground added successfully'
                    });
                    this.loadGrounds();
                }
            }, err => {
                this.errorHandle(err)
            });
        }
    }
    addGroundCancel() {
        this.addGroundDialog = false;
        this.groundform.reset();
    }
    Sport(event) {
        this.isNewSport = true;
        this.isAddSport = false;
        if (event.target.checked === true) {
            this.isNotOthers = false;
        } else {
            this.isNotOthers = true;
            this.isNewSport = false;
        }
        console.log(event)
        console.log(event.target.checked)
    }
    addSport(event) {
        this.isNewSport = false;
        if (event.target.checked === true) {
            this.isAddSport = true;
            this.isNotNewOther = false;
        } else {
            this.isAddSport = false;
            this.isNotNewOther = true;
        }
    }
    otherSportKey(name) {
        if (name.length > 0) {
            $('.edit_ground2').removeAttr('disabled');
        } else {
            $('.edit_ground2').attr('disabled', 'disabled');
            // $('.edit_ground1').attr('disabled', 'disabled');
        }
        console.log('key up', name);
    }
    groundChangeKey(ground) {
        if (ground.length > 0) {
            $('.edit_ground1').removeAttr('disabled');
        } else {
            $('.edit_ground1').attr('disabled', 'disabled');
        }
    }
    // saveSport(sport){
    //     $('.modal-backdrop').hide();
    //     this.isNewSport=false;
    //     this.groundform.reset();
    //     console.log('save sport is ', sport.sportName)
    //     console.log('groundId is', this.edit_groundId)
    // this.groundsservice.addSport(this.edit_groundId,
    //     sport.sportName).subscribe((data) => {
    //         getSports(this.edit_groundId);
    // })
    // }
    createSport(sport) {
        $('.modal-backdrop').hide();
        this.isAddSport = false;
        console.log('save sport is ', sport.sportName);
    }
    changeSport(e, val) {
        console.log('checked', e);
        console.log('sport', val);
    }
    updateGround(ground) {
        this.loadingBar = true;
        document.getElementById('editGroundClose').click();
        $('.modal-backdrop').hide();
        if (this.selectedSportArray.length === 0 && (this.other_sportName === undefined || this.other_sportName === '')) {
            console.log('updated ground ', ground);
            console.log('update groundId ', this.edit_groundId)
            // console.log('update Sport',this.edit_sportName)
            const outputParams = {
                'authorizationToken': sessionStorage.getItem('authorizationToken'),
                'cityId': sessionStorage.getItem('cityId'),
                'parkId': localStorage.getItem('defaultParkId'),
                'groundName': ground,
                'groundId': this.edit_groundId
                // 'sport': this.groundData.sportName
            };
            console.log('edit ground', outputParams)
            this.groundform.reset();
            this.groundsservice.editGround(outputParams).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    this.loadingBar = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Grounds Update',
                        detail: 'Ground updated successfully'
                    });
                    this.loadGrounds();
                }
            }, err => {
                this.errorHandle(err)
            });
        } else if (this.selectedSportArray.length > 0 && (this.other_sportName === undefined || this.other_sportName === '')) {
            console.log('sport update groundId ', this.edit_groundId);
            console.log('sport updated ground ', ground);
            console.log('sport update Sport ', this.selectedSportArray);
            const outputParams = {
                'authorizationToken': sessionStorage.getItem('authorizationToken'),
                'cityId': sessionStorage.getItem('cityId'),
                'parkId': localStorage.getItem('defaultParkId'),
                'groundName': ground,
                'groundId': this.edit_groundId,
                'sport': JSON.stringify(this.selectedSportArray)
            };
            console.log('edit ground', outputParams)
            this.groundform.reset();
            this.groundsservice.editGround1(outputParams).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    this.loadingBar = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Grounds Update',
                        detail: 'Ground updated successfully'
                    });
                    this.loadGrounds();
                }
                this.selectedSportArray = [];
                this.other_sportName = undefined;
            }, err => {
                this.errorHandle(err)
            });
        } else if ((this.other_sportName !== undefined || this.other_sportName !== '') && this.selectedSportArray.length === 0) {
            console.log('other sport update groundId ', this.edit_groundId)
            console.log('other sport updated ground ', ground)
            console.log('other sport update Sport ', this.other_sportName)
            const outputParams = {
                'authorizationToken': sessionStorage.getItem('authorizationToken'),
                'cityId': sessionStorage.getItem('cityId'),
                'parkId': localStorage.getItem('defaultParkId'),
                'groundName': ground,
                'groundId': this.edit_groundId,
                'sport': this.other_sportName
            };
            console.log('edit ground', outputParams)
            this.groundform.reset();
            this.groundsservice.editGround1(outputParams).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    this.other_sportName = undefined;
                    this.loadingBar = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Grounds Update',
                        detail: 'Ground updated successfully'
                    });
                    this.loadGrounds();
                }
            }, err => {
                this.errorHandle(err)
            });
        }
    }
    updateSport(sport) {
        document.getElementById('addNewSportClose').click();
        $('.modal-backdrop').show();
        this.showEditGround = true;
        this.other_sportName = sport.sportName;
        console.log('other sport ', this.other_sportName)
        this.availableSports = [];
        $('.sprts_chck_box input:checkbox').removeAttr('checked');
        this.isNotOthers = true;
        this.isNewSport = false;
        this.createNewSport.sportName = '';
    }
    cancelSport() {
        $('.modal-backdrop').show();
        this.showEditGround = true;
    }
}

export class Parameters {
    name: string;
    value: string;
}

export class GetParametersCallback implements Callback {

    constructor(public me: GroundsComponent, public cognitoUtil: CognitoUtil) {

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
