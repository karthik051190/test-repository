import { environment } from './../../environments/environment';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserFormService} from '../service/user-form.service';
import {CitiesService} from '../service/cities.service'
import {Sport} from '../models/sport';
import { DropdownModule, Dropdown } from 'primeng/primeng';
import {Ground} from '../models/ground';
import {Validators, FormControl, FormGroup, FormBuilder, AsyncValidator} from '@angular/forms';
import {Reservation} from '../models/reservation';
import * as moment from 'moment';
import {Moment} from 'moment';
import { ActivatedRoute  } from '@angular/router';
import { NumberFormatStyle } from '@angular/common';
declare let $;


declare let AWS: any;
declare let AWSCognito: any;


@Component({
    selector: 'app-landinghome',
    templateUrl: './landinghome.html',
    styleUrls: ['../../assets/slotsAssets/css/style.css']
})
export class HomeLandingComponent implements OnInit {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
    cityNumber: number;
    opendates = [];
    openmonths = [];
    captchaResolved: boolean = false;
    // waitdates = [{day: 21, month: 9, year: 2018}];
    // closeddates = [20];
    // value = '17';
    public sportsList = [];
    public groundsList = [];
    timeSlots = [];
    startDate: any = moment().format('YYYY-MM-DD');
    endDate: any = moment(this.startDate).endOf('month');
    loadingBar = false;
    conflictResponse = {};
    reservationMessageError = null;
    reservationMessageOverlap = null;
    reservationMessageSuccess = null;
    reservationData = new Reservation();
    selectedSport: any;
    selectedGround: any;
    slotDetailsPage: boolean;
    userDetailsPage: boolean;
    termsCheck: boolean;
    public terms: boolean;
    weekdayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    currentDate = new Date();
    currentDay: string;
    currentWeek: string;
    minDate: Moment;
    // maxDate: Moment;
    slotsAvailable = [];
    reservationform: FormGroup;
    slotValue: string;
    slotsLabel: string;
    cityName: string;
    address: string;
    website: string;
    slotUnAvailable = false;
    slot_message = '';
    dropDownGrounds: Dropdown;
    emailContent: string;
    selectedSlotStatus: any;
    selectedSlotFIFO: any;
    weatherReport:any;



    constructor(public router: Router,
        public userFormService: UserFormService,
        public citiesService: CitiesService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.slotDetailsPage = true;
        this.userDetailsPage = false;
        this.terms = false;
        console.log('HomeLandingComponent constructor');
        // this.route.params.subscribe(params => {
        //     sessionStorage.setItem('cityId', params['cityId']);
        //     console.log('cityId from path: ', params['cityId']);
        // this.citiesService.getCity(sessionStorage.getItem('cityId')).subscribe((data) => {
        // this.cityName = sessionStorage.getItem('cityName');
        // this.address = sessionStorage.getItem('address');
        // this.website = sessionStorage.getItem('website');
        // console.log('returnData: ', data);
        // });
        // });
    }
    ngOnInit() {
        // var state=sessionStorage.getItem('state')
        // var _this=this;
        // $.simpleWeather({
        //     location: sessionStorage.getItem('location'),
        //     unit: 'f',
        //     success: function(weather) { 
        //     console.log(sessionStorage.getItem('cityName')+" Whether Report is::",weather)
        //     var weatherReport=JSON.stringify(weather);
        //     _this.weatherReport=JSON.parse(weatherReport);
        //     console.log("!!!!!!!!!!!!!!!!!!!!",_this.weatherReport)
        //     },
        //     error: function(error) { console.log(error) }
        // });
        /* this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website'); */
        this.setCityDetails();
        this.getSports();
        this.reservationform = this.formbuilder.group({
            'sportId': new FormControl('', Validators.required),
            'groundId': new FormControl('', Validators.required),
            'selectedDate': new FormControl('', Validators.required),
            'timeSlot': new FormControl('', Validators.required),
            'firstName': new FormControl('', Validators.required),
            'lastName': new FormControl('', Validators.required),
            'teamName': new FormControl(''),
            'residentOf': new FormControl(''),
            'email': new FormControl('', [Validators.email, Validators.required]),
            'phoneNum': new FormControl('', [Validators.min(1000000000), Validators.max(9999999999), Validators.required]),
        });
        this.slotsLabel = 'Select a slot';
        this.termsCheck = false;
        console.log(this.currentDate.getDay());
        this.restrictDays();
    }
    getWeather() {
        var _this=this;
        $.simpleWeather({
            location: sessionStorage.getItem('location'),
            unit: 'c',
            success: function(weather) {
            console.log(sessionStorage.getItem('cityName') + ' Whether Report is::' , weather);
            var weatherReport = JSON.stringify(weather);
            _this.weatherReport = JSON.parse(weatherReport);
            console.log('This is the weather report:', _this.weatherReport);
            },
            error: function(error) { console.log(error) }
        });
    }
    updateUrl(event) {
        console.log('failed url:', this.somevalue);
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
        console.log('new url:', this.somevalue);
      }
      getAdminEMails() {
        this.userFormService.getAdminEMails().subscribe((data) => {
            this.emailContent = 'mailto:' + data + '?Subject=Custom Slot Request&body=Hello Admin,%0D%0A%0D%0AI would like to create a custom slot, %0D%0ADetails are listed below. %0D%0A%0D%0A(Fill the below details)%0D%0APark Name*:%0D%0AGround Name*:%0D%0ASport*:%0D%0ADate*:%0D%0ASlot Time*:%0D%0AName*:%0D%0APhone*:%0D%0AEmail*:%0D%0ATeam:%0D%0AResident Of:%0D%0A%0D%0AThank You.';
        });
      }
    setCityDetails() {
        this.loadingBar = true;
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
        if (this.cityName === '' || this.cityName === undefined) {
             this.setCityDetails(); }
        setTimeout(() => {
        this.loadingBar = false;
        this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
        this.somevalue = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
        this.getSports();
        this.getWeather();
        }, 2000);
        setTimeout(() => {
            this.getWeather();
        }, 1000);
        this.getSports();
        this.getAdminEMails();
        // return this.cityName;
    }
    onClear() {
        this.reservationform.reset();
        this.terms = false;
        this.reservationform['selectedDate'] = '';
    }
    onCickNext() {
        this.slotDetailsPage = false;
        this.userDetailsPage = true;
    }
    onClickBack() {
        this.slotDetailsPage = true;
        this.userDetailsPage = false;
    }
    onTerms() {
        if (this.captchaResolved === true) {
        this.terms = true;
        } else {this.terms = false;
            alert('No bots please'); }
    }
    onTermsCheck() {
        console.log('terms and conditions:', this.termsCheck);
    }
    onFormSubmit() {
        this.loadingBar = true;
        if (this.reservationData.teamName === '' || this.reservationData.teamName === undefined) {
            this.reservationData.teamName = null;
        }
        // this.router.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>
        //     this.router.navigate(['HomeLandingComponent']));
        this.reservationData.selectedDate = moment(this.reservationData.selectedDate).format('YYYY-MM-DD');
        console.log('sport is: ', this.reservationData.sportId);
        const phone = '+1'.concat(this.reservationData.phoneNumber);
        // const date = new Date();
        // const toDay = moment().format('YYYY-MM-DD hh:mm:ss');
        const createdAt = moment().tz('America/Chicago').format('YYYY-MM-DD hh:mm:ss');
        // const url = 'https://xc8ncm33t7.execute-api.us-west-2.amazonaws.com/test/verifycredentials';
        // let slotValue = '';
        // this.timeSlots.forEach((each) => {
        //   if (each.slotId === this.userData.slot) {
        //    const slotValue = each.slot;
        //   }
        // });
        if (this.reservationData.residentOf === '' || this.reservationData.residentOf === undefined || this.reservationData.residentOf === null ){
            this.reservationData.residentOf = null;
        }
        const params = {
            'phoneNumber': phone,
            'slotId': this.reservationData.slot,
            'slot': this.slotValue,
            'slotStatus': this.selectedSlotStatus,
            'slotFIFO': this.selectedSlotFIFO,
            'reservationDate': this.reservationData.selectedDate,
            'cityId': sessionStorage.getItem('cityId'),
            'groundId': this.reservationData.groundId,
            'sportId': this.reservationData.sportId,
            'createdAt': createdAt,
            'firstName': this.reservationData.firstName,
            'lastName': this.reservationData.lastName,
            'email': this.reservationData.email,
            'teamName': this.reservationData.teamName,
            'residentOf': this.reservationData.residentOf,
            'stage': environment.logoStage
        };
        this.termsCheck = false;
        this.terms = false;
        console.log('Model data is:', this.reservationData);
        console.log('Add reservation params are:', params);
        this.userFormService.submitReservation(params).subscribe((data) => {
            console.log('Response is: ', data);
            this.conflictResponse['msg'] = data.msg;
            this.checkConflict();
        });
    }
    clearMessages() {
        this.reservationMessageOverlap = null;
        this.reservationMessageSuccess = null;
        this.reservationMessageError = null;
    }
    resolved(captchaResponse: string) {
        let resolvedKey = captchaResponse;
        if (resolvedKey === '' || resolvedKey === undefined || resolvedKey === null) {
            this.captchaResolved = false;
        } else {
            this.captchaResolved = true;
        }
        console.log(`Resolved captcha: ${captchaResponse}`);
    }
    checkConflict() {
        this.loadingBar = true;
        // this.conflictResponse = {'msg': 'overlap'};
        console.log('Response is: ', this.conflictResponse['msg']);
        if (this.conflictResponse['msg'] === 'overlap') {
            // this.showMessage('info', '', 'Your request for this slot already exists.');
            this.loadingBar = false;
            this.reservationMessageOverlap = 'Your reservation request already exists';
            // this.reservationform.reset();
            // this.router.navigate(['/home/""']);
            setTimeout(() => {
                this.clearMessages();
            }, 7000);
            this.reservationData = new Reservation();
        } else if (this.conflictResponse['msg'] === 'Reservation request submitted. Notification sent!') {
            // this.reservationform.reset();
            // this.getSports();
            // this.showMessage('success', '', 'Your request has been received.');
            this.loadingBar = false; // } else if (this.conflictResponse['msg'] === 'limitReached') {
            this.slotDetailsPage = true;
            this.userDetailsPage = false;
            //   // this.showMessage('warn', 'Maximum Limit Reached:', 'Only 2 reservation requests allowed per day.');
            this.reservationMessageSuccess = 'Request has been successfully submited';
            setTimeout(() => {
                this.clearMessages();
            }, 7000);
            this.reservationData = new Reservation();
        } else if (this.conflictResponse['msg'] === 'error') {
            // this.reservationform.reset();
            // this.getSports();
            // this.showMessage('error', '', 'Error booking your slot, Please contact our office at 972-874-6300');
            this.loadingBar = false;
            this.reservationMessageError = 'Error submiting your request, Please contact our office at 972-874-6300';
            setTimeout(() => {
                this.clearMessages();
            }, 7000);
            this.reservationData = new Reservation();
        } else {
            // this.reservationform.reset();
            // this.getSports();
            this.loadingBar = false;
            this.reservationMessageError = 'An unexpected error occured, Unable to submit request at this time';
            setTimeout(() => {
                this.clearMessages();
            }, 7000);
            this.reservationData = new Reservation();
        }
        // this.showMessage('warn', this.conflictResponse['msg'], this.conflictResponse['msg']);

    }
    loginAsAdmin() {
        console.log('on router button click');
        this.router.navigate(['/home/login']);
    }
    restrictDays() {
        // this.currentDay = moment().format('dddd').toString();
        // console.log('Current Day is', this.currentDay);
        // this.currentWeek = moment().format('w');
        this.minDate = (moment())['_d'];
        // if (this.weekdayList.indexOf(this.currentDay) > -1) {
        //     this.minDate = (moment().add(1, 'weeks').startOf('isoWeek'))['_d'];
        //     // this.maxDate = (moment().add(1, 'weeks').endOf('isoWeek'))['_d'];
        //     console.log(this.currentDay, this.minDate,  ' is a weekday');
        // } else {
        //     this.minDate = (moment().add(2, 'weeks').startOf('isoWeek'))['_d'];
        //     // this.maxDate = (moment().add(2, 'weeks').endOf('isoWeek'))['_d'];
        //     console.log(this.currentDay, this.minDate,  ' is not a weekday');
        // }
    }
    getSports() {
        this.sportsList = [];
        this.loadingBar = true;
        this.userFormService.getSports(sessionStorage.getItem('cityId')).subscribe((data) => {
            // let tempObjArray: Ground[] = [];
            console.log("sports data response from API call is", data);
            this.sportsList = [];
            if (data.length === 0) {
                setTimeout(() => {
                    this.loadingBar = false;
                }, 3000);
            } else {
                data.forEach((o) => {
                    console.log(o);
                    let obj = new Sport();
                    const temp = {};
                    temp['value'] = o.Sport_Id;
                    temp['label'] = o.Sport_Name;
                    this.sportsList.push(temp);
                });
                this.loadingBar = false;
                // this.getSportsByGround(this.selectedGround);
                console.log('sport data is: ', this.sportsList);
            }
        });
    }
    getGroundsBySport(inputParams) {
        this.reservationData.slot = null;
        this.opendates = [];
        this.reservationData.groundId = null;
        this.reservationData.selectedDate = null;
        this.groundsList = [];
        this.loadingBar = true;
        console.log("get grounds for sportId :", inputParams);
        let outputParams = {
            'sportId': inputParams,
            'cityId': sessionStorage.getItem('cityId')
        }
        this.selectedGround = '';
        this.userFormService.getGrounds(outputParams).subscribe((data) => {
            console.log('this is the data', data);
            this.groundsList = [];
            if (data.length === 0) {
                this.loadingBar = false;
            } else {
                data.forEach((o) => {
                    console.log(o);
                    let obj = new Ground();
                    const temp = {};
                    temp['value'] = o.Ground_Id;
                    temp['label'] = o.Ground_Name + ' - ' + o.Park_Name;
                    this.groundsList.push(temp);
                });
                this.loadingBar = false;
                console.log('groundsList data is: ', this.groundsList);

            }

        });
    }
    onMonthClick(params) {
        this.openmonths = [];
        this.opendates = [];
        console.log('On month change click event:', params);
        this.startDate = moment([params.year, params.month - 1]).format('YYYY-MM-DD');
        this.endDate = moment(this.startDate).endOf('month');
        // this.openmonths.push(params.month);
        console.log('The first date is:', this.startDate, 'The last date is:', this.endDate.format('YYYY-MM-DD'));
        this.getSlots(this.reservationData.groundId);
    }
    getSlots(groundId) {
        this.reservationData.slot = null;
        this.reservationData.selectedDate = null;
        this.reservationData.slot = null;
        this.opendates = [];
        this.loadingBar = true;
        this.reservationData.selectedDate = '';
        this.reservationData.slot = '';

        console.log('Selected ground Id is: ', groundId);
        const params = {
            'cityId': sessionStorage.getItem('cityId'),
            'sportId': this.reservationData.sportId,
            'groundId': groundId,
            'startDate': this.startDate,
            'endDate': this.endDate.format('YYYY-MM-DD')
        };
        this.userFormService.getSlotsAvailable(params).subscribe((data) => {
                const temp: Reservation[] = [];
                console.log('get slots data..........: ', data);
                for (let i = 0; i < data.length; i ++) {
                    let date = moment().format('YYYY-MM-DD');
                    data[i].Slots.forEach((obj) => {
                    let openDate = obj.Slot_Open_Date;
                    let closeDate = obj.Slot_Close_Date;
                    console.log(date, openDate, closeDate);
                    if (moment(date).isSameOrAfter(openDate) && moment(date).isSameOrBefore(closeDate)) {
                        this.opendates.push(moment(data[i].Date).format('DD'));
                        this.openmonths.push(parseInt(moment(data[i].Date).add(-1, 'months').format('M'), 10));
                        console.log('This is the open dates:', this.openmonths);
                    }
                });
                    // const objArray = new Reservation();
                    // objArray.slots = data[i].Slots;
                    // objArray.sportId = data[i].Sport_Id;
                    // objArray.selectedDate = data[i].Date;
                    // objArray.groundId = data[i].Ground_Id;
                    // objArray.parkId = data[i].Park_Id;
                    // // objArray.day = data[i].day;
                    // temp.push(objArray);
                }
                this.opendates.map(Number);
                // let unique_array = []
                for (let i = 0; i < this.opendates.length; i++) {
                    this.opendates[i] = parseInt(this.opendates[i], 10); }
                this.loadingBar = false;
                // this.slotsAvailable = temp;
                this.slotsAvailable = data;
                // console.log('this is the slots available', this.slotsAvailable);
                console.log('this is the data', data);
            },
            (error) => {
                this.loadingBar = false;
                console.log(error);
            });
    }
    test(test) {
        console.log('test is', test);
    }
    onDateSelected() {
        this.reservationData.slot = null;
        this.slot_message = '';
        this.slotUnAvailable = false;
        console.log('this is the selected dates', this.reservationData.selectedDate);
        this.timeSlots = [];
        // const date = moment(this.reservationData.selectedDate).format('YYYY-MM-DD');
        this.slotsAvailable.forEach(each => {
            // let day = this.userData.selectedDate;
            const date = moment(this.reservationData.selectedDate).format('YYYY-MM-DD');
            // let count = 0;
            // console.log('array is: ', each, date);
            // if (((new Date(each.date)).getTime() === (new Date(date)).getTime()) ) {
            // console.log("this is the each date", each.date);
            if (each.Date === date) {
                console.log('each date: ', each.Date);
                each.Slots.forEach((obj) => {
                    // count++;
                    const tmp = {};
                    tmp['label'] = obj.Slot;
                    tmp['value'] = obj.Slot_Id;
                    // const tmp1 = {};
                    tmp['Slot_Open_Date'] = obj.Slot_Open_Date;
                    tmp['Slot_Close_Date'] = obj.Slot_Close_Date;
                    tmp['Slot_Status'] = obj.Slot_Status;
                    tmp['Auto_FIFO'] = obj.Auto_FIFO;
                    this.timeSlots.push(tmp);

                });
            }
        });
        if (this.timeSlots.length === 0) {
            this.slotUnAvailable = true;
            this.slotsLabel = 'No Slots Available On This Day';
            // this.slotsLabel = 'No slots available on this day';
            // tmp['value'] = obj.Slot_Id;
            // this.timeSlots.push(tmp); 
            // alert('No slots available on that day. Please select another day.');
        }else {
        this.slotsLabel = 'Select a slot'; }

        console.log('slots available on that day', this.timeSlots);
    }
    onSelectSlot(slot) {
        this.slot_message = '';
        this.slotUnAvailable = false;
        console.log('these are the time slots', slot, this.timeSlots);
        this.timeSlots.forEach((each) => {
            if (each.value === slot) {
                this.slotValue = each.label;
                this.selectedSlotFIFO = each.Auto_FIFO;
                this.selectedSlotStatus = each.Slot_Status;
                console.log('today: ', moment().format('YYYY-MM-DD'), 'Opens date:', each.Slot_Open_Date, 'Close date:', moment(each.Slot_Close_Date));
            if (moment(each.Slot_Open_Date).isAfter(moment().format('YYYY-MM-DD'))) {
                console.log('slot opens later', moment().format('YYYY-MM-DD'), moment(each.Slot_Open_Date));
                this.slot_message = 'Booking for this slot opens on ' + moment(each.Slot_Open_Date).format('YYYY-MM-DD') + '.';
                this.slotUnAvailable = true;
            } else if (moment(each.Slot_Close_Date ).isBefore(moment().format('YYYY-MM-DD'))) {
                console.log('slot booking closed');
                this.slot_message = 'Booking for this slot was closed on ' + moment(each.Slot_Close_Date ).format('YYYY-MM-DD') + '!';
                this.slotUnAvailable = true;
            } else {
                if (each.Slot_Status === 'Reserved') {
                    console.log('slot is in wait list');
                    this.slot_message = 'This slot is already reserved, your request will be taken in waitlist.';
                } else {
                    console.log('slot is Available to book');
                }
            }}
        });
        console.log('slot is', this.slotValue);
    }
}

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
    styleUrls: ['../../assets/slotsAssets/css/style.css']
})
export class HomeComponent implements OnInit {

    constructor(public router: Router) {
        console.log('HomeComponent constructor');
    }

    ngOnInit() {

    }
}
