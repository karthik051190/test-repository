import { Component, OnInit, ViewChild } from '@angular/core';
import { UserLoginService } from '../../service/user-login.service';
import { Callback, CognitoUtil, LoggedInCallback } from '../../service/cognito.service';
import { Router } from '@angular/router';
import { SlotsService } from '../../service/slots.service';
import { Ground } from '../../models/ground';
import { Slot } from '../../models/slot';
import { Schedule } from '../../models/schedule';
import { Sport } from '../../models/sport';
import { DropdownModule } from 'primeng/primeng';
import {EventEmitter, Output} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {SlotsCalendarComponent} from './slots-calendar/slots-calendar.component';
import {CognitoRefreshToken} from 'amazon-cognito-identity-js';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';
import * as moment from 'moment';
import {Moment} from 'moment';

export class Stuff {
    public accessToken: string;
    public idToken: string;
}

@Component({
    selector: 'app-slots',
    templateUrl: './slots.html',
    styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements LoggedInCallback, OnInit {
    @ViewChild(SlotsCalendarComponent) private child: SlotsCalendarComponent;
    @Output() valueChange = new EventEmitter<any>();
    public stuff: Stuff = new Stuff();
    createSlot = new Slot();
    createSchedule = new Schedule();
    public allGrounds = [];
    public allSports = [];
    unauthorized = false;
    error = false;
    weekdayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // selectedDate = new Date();
    selectedDate: any;
    currentDay: string;
    currentWeek: string;
    minDate: Moment;
    maxDate: Moment;
    public Sports = [];
    options = {
        responsive: false,
        maintainAspectRatio: false,
        legend: { position: 'bottom', align: 'left' }
    };
    // days = {'Mon': true, 'Tue': true, 'Wed': true, 'Thu': true, 'Fri': true, 'Sat': true };
    scheduleDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    data: any;
    canceledCount = 0;
    availableCount = 0;
    reservedCount = 0;
    requestedCount = 0;
    selectedGround: any;
    loadingBar = false;
    selectedSport: any;
    selectedPark: any;
    slotsCount: any;
    refreshToken: any;
    newSlot: any;
    showScheduleCustomDates: any;
    showSlotCustomDates: any = true;
    weekDays = {};
    // openBeforeCount: any;
    // closeBeforeCount: any;
    slotOpenCategory: any;
    // scheduleCategory: any;
    selectedGroundInstance: any;
    selectedGroundInstanceName: any;
    constructor(public router: Router,
        public userService: UserLoginService,
        public cognitoUtil: CognitoUtil,
        public slotsservice: SlotsService,
        private messageService: MessageService) {
        this.userService.isAuthenticated(this);
        console.log('in SlotsComponent');
        // sessionStorage.setItem('parkName', 'Bakersfield');

    }

    ngOnInit() {
        this.createSlot.autoFIFO = false;
        this.createSlot.paidSlot = false;
        this.createSlot.slotCategory = 'custom';
        this.createSchedule.autoFIFO = false;
        this.createSchedule.paidSlot = false;
        this.getGrounds();
        this.pieCount();
        this.weekDays = { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
        this.selectedPark = localStorage.getItem('defaultParkName');
        console.log('selected Park is:', this.selectedPark);
    }

    pieCount() {
        this.data = {
            labels: ['Reserved', 'Available', 'Requested', 'Canceled'],
            datasets: [
                {
                    data: [this.reservedCount, this.availableCount, this.requestedCount, this.canceledCount],
                    backgroundColor: ['#3f51b5', '#2da95b', '#f44336', '#a6a6a6'],
                    hoverBackgroundColor: ['#162ab5', '#05a948', '#f4291c', '#828282']
                }]
        };
    }
    // selectCustomDates() {
    //     this.showcustomDates = true;
    //     this.slotOpenCategory = 'custom';
    // }
    // testEvent(test) {
    //     console.log('this is the test', test);
    // }
    setScheduleOpenDates(params) {
        if (params !== 'custom') {
        this.showScheduleCustomDates = false; } else {
            this.showScheduleCustomDates = true;
        }
        this.createSchedule.scheduleCategory = params;
        console.log('This is the slot open category', this.createSchedule.scheduleCategory);
    }
    setSlotOpenDates(params) {
        if (params !== 'custom') {
        this.showSlotCustomDates = false; } else {
            this.showSlotCustomDates = true;
        }
        this.createSlot.slotCategory = params;
        console.log('This is the slot open category', this.createSlot.slotCategory);
    }
    displayCounter(data) {
        console.log('counts data: ', data);
        this.slotsCount = data;
        this.reservedCount = data['reservedCount'];
        this.availableCount = data['availableCount'];
        this.requestedCount = data['requestedCount'];
        this.canceledCount = data['canceledCount'];
        this.pieCount();
    }
    errorIn(data) {
        console.log('this is the error in data:', data);
        this.error = data;
    }
    unauthorizedIn(data) {
        console.log('this is the unauthorized in data:', data);
        this.unauthorized = data;
    }
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.cognitoUtil.getAccessToken(new AccessTokenCallback(this));
            this.cognitoUtil.getIdToken(new IdTokenCallback(this));
        }
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

    getGrounds() {
        this.loadingBar = true;
        console.log('cityId', sessionStorage.getItem('cityId'));
        this.cognitoUtil.refresh();
        const params = {
            'parkId': localStorage.getItem('defaultParkId'),
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.slotsservice.getGrounds(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'No grounds exist' });
                    this.loadingBar = false;
                    console.log('In no sports section grounds route');
                    this.router.navigate(['admin/grounds']);
                } else {
                    response.body.forEach((o) => {
                        console.log(o);
                        let obj = new Ground();
                        const temp = {};
                        temp['value'] = o;
                        temp['label'] = o.Ground_Name;
                        this.allGrounds.push(temp);
                    });
                    this.selectedGround = this.allGrounds[0].value;
                    console.log('this is initial select ground', this.selectedGround);
                    this.getSportsByGround(this.selectedGround);
                    console.log('sportList data is: ', this.allGrounds);
                    this.loadingBar = false;
                }
            }
        },
            err => { this.errorHandle(err) });
    }
    generateOpenDates(params) {
        console.log('generateOpenDates is called', params);
        this.selectedDate = moment(params).format('dddd').toString();
        console.log('Current Day is', this.selectedDate);
        // this.currentWeek = moment().format('w');
        // if (this.weekdayList.indexOf(this.selectedDate) > -1) {
            this.minDate = (moment(params).add(-1, 'weeks').startOf('isoWeek'))['_d'];
            this.maxDate = (moment(params).add(-1, 'weeks').endOf('isoWeek'))['_d'];
            console.log(this.selectedDate, this.minDate, this.maxDate,  ' is a weekday');
            this.createSlot.openDate = this.minDate;
            this.createSlot.closeDate = this.maxDate;
            console.log('openDate:', this.createSlot.openDate, 'closeDate:', this.createSlot.closeDate);
        // } else {
            // this.minDate = (moment(params).add(-1, 'weeks').startOf('isoWeek'))['_d'];
            // this.maxDate = (moment(params).add(-1, 'weeks').endOf('isoWeek'))['_d'];
            // console.log(this.selectedDate, this.minDate, this.maxDate,  ' is not a weekday');
            // this.createSlot.openDate = this.minDate;
            // this.createSlot.closeDate = this.maxDate;
        // }
    }
    getSportsByGround(inputParams) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        this.selectedGroundInstance = inputParams.Ground_Id;
        this.selectedGroundInstanceName = inputParams.Ground_Name;
        console.log('get sports for', inputParams);

        this.selectedSport = '';
        this.allSports = [];
        // if(inputParams.hasOwnProperty(''))
        const params = {
            'groundId': inputParams.Ground_Id,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.slotsservice.getSports(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'No sports exist' });
                    this.loadingBar = false;
                    // console.log('In no sports section GS route');
                    // this.router.navigate(['admin/grounds']);
                } else {
                    response.body.forEach((o) => {
                        console.log(o);
                        let obj = new Sport();
                        const temp = {};
                        temp['value'] = o.Sport_Id;
                        temp['label'] = o.Sport_Name;
                        this.allSports.push(temp);

                    });
                    console.log('sportList data is: ', this.allSports);
                    this.loadingBar = false;
                }
            }
        },
            err => { this.errorHandle(err) });
    }
    onSportChange(params) {
        console.log('on sport change', params);
    }

    getSlotsCount(params) { }

    addSlot(dataIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('save data', dataIn);
        document.getElementById('addslot').click();
        let startTime = moment(dataIn.startTime).format('hh:mm A');
        let endTime = moment(dataIn.endTime).format('hh:mm A');
        let slotStartTime = isNaN(parseInt(startTime)) ? dataIn.startTime : startTime;
        let slotEndTime = isNaN(parseInt(endTime)) ? dataIn.endTime : endTime;
        let slot = `${slotStartTime} - ${slotEndTime}`;
        let sDate = moment(dataIn.date).format('YYYY-MM-DD');
        if (dataIn.autoFIFO === undefined || dataIn.autoFIFO === null) {
            dataIn.autoFIFO = false;
        }
        if ( dataIn.slotCategory === 'always') {
            dataIn.openDate = moment().format('YYYY-MM-DD');
            dataIn.closeDate = moment(sDate).add(-1, 'days')}
        const params = {
            'sportId': dataIn.sportId,
            'groundId': dataIn.groundId.Ground_Id,
            'repId': localStorage.getItem('repId'),
            'slot': slot,
            'date': sDate,
            'parkId': localStorage.getItem('defaultParkId'),
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'openDate': moment(dataIn.openDate).format('YYYY-MM-DD'),
            'closeDate': moment(dataIn.closeDate).format('YYYY-MM-DD'),
            'slotCategory': dataIn.slotCategory,
            'autoFIFO': dataIn.autoFIFO
        };
        console.log('save slot', params);
        this.slotsservice.addSlot(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.msg === 'overlap') {
                    this.createSlot = new Slot();
                    this.loadingBar = false;
                    this.createSlot = new Slot();
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'There is an overlap with an other slot : \n' + response.body.overlapSlot[0].Slot });
                } else if (response.body.msg === 'success') {
                    this.createSlot = new Slot();
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Slot added successfully' });
                    this.createSlot = new Slot();
                    this.child.reloadSlots();
                    this.loadingBar = false;
                }
            // }
        }  this.createSlot.slotCategory = 'custom'; },
            err => {
                this.createSlot = new Slot();
                this.createSlot.slotCategory = 'custom';
                this.errorHandle(err)});
    }
    clearAddSlot() {
        this.createSlot = new Slot();
        this.createSlot.slotCategory = 'custom';
    }
    clearAddSchedule() {
        this.createSchedule = new Schedule();
    }
    addSchedule(dataIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('save data', dataIn);
        document.getElementById('addslot').click();
        let startTime = moment(dataIn.startTime).format('hh:mm A');
        let endTime = moment(dataIn.endTime).format('hh:mm A');
        let slotStartTime = isNaN(parseInt(startTime)) ? dataIn.startTime : startTime;
        let slotEndTime = isNaN(parseInt(endTime)) ? dataIn.endTime : endTime;
        let slot = `${slotStartTime} - ${slotEndTime}`;
        let sDate = moment(dataIn.startDate).format('YYYY-MM-DD');
        let eDate = moment(dataIn.endDate).format('YYYY-MM-DD');
        if (dataIn.scheduleCategory !== 'custom') {
            dataIn.openBefore = undefined;
            dataIn.closeBefore = undefined;
        }
        if (dataIn.autoFIFO === undefined || dataIn.autoFIFO === null) {
            dataIn.autoFIFO = false;
        }
        const params = {
            'sportId': dataIn.sportId,
            'groundId': dataIn.groundId,
            'repId': localStorage.getItem('repId'),
            'slot': slot,
            'startDate': sDate,
            'endDate': eDate,
            'parkId': localStorage.getItem('defaultParkId'),
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'days': JSON.stringify(this.weekDays),
            'scheduleCategory': dataIn.scheduleCategory,
            'startBefore': dataIn.openBefore,
            'endBefore': dataIn.closeBefore,
            'autoFIFO': dataIn.autoFIFO
        };
        console.log('params to add schedule', params);
        console.log('params days to add schedule', params.days);
        this.slotsservice.addSchedule(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.createSchedule = new Schedule();
                if (response.body.msg === 'overlap') {
                    this.loadingBar = false;
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'There is an overlap with an other slot : \n' + response.body.overlapSlot[0].Slot });
                } else if (response.body.msg === 'success') {
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Schedule added successfully' });
                    this.loadingBar = false;
                    this.child.reloadSlots();
                }
            }
        },
            err => {
                this.createSchedule = new Schedule();
                this.errorHandle(err)
            });
    }

    onSelect(event) {
        console.log('calendar click event fired', event)
    }

    getSports(paramsIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        this.Sports = [];
        console.log('get sports by ground in add slot', paramsIn);
        const params = {
            'groundId': paramsIn,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.slotsservice.getSports(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.length === 0) {
                    this.loadingBar = false;
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'No sports exist' });
                } else {
                    response.body.forEach((o) => {
                        console.log(o);
                        let obj = new Sport();
                        const temp = {};
                        temp['value'] = o.Sport_Id;
                        temp['label'] = o.Sport_Name;
                        this.Sports.push(temp);

                    });
                    this.loadingBar = false;
                    console.log('sportList data is: ', this.Sports);
                }
            }
        },
            err => { this.errorHandle(err) });
    }
    onDaySelection(day) {
        if (this.weekDays[day] === false) {
            this.weekDays[day] = true;
        } else {
            this.weekDays[day] = false;
        }
    }
}

export class AccessTokenCallback implements Callback {
    constructor(public slots: SlotsComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.slots.stuff.accessToken = result;
    }
}

export class IdTokenCallback implements Callback {
    constructor(public slots: SlotsComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.slots.stuff.idToken = result;
    }
}

export class MyModel {
    value: Date;
}
