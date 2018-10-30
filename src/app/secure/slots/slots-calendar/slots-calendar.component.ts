import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { SlotsService } from '../../../service/slots.service';
import { Slot } from '../../../models/slot';
import { Ground } from '../../../models/ground';
import { Sport } from '../../../models/sport';
import { Reservation } from '../../../models/reservation';
import { CalendarModule } from 'primeng/primeng';
import * as moment from 'moment';
import 'moment-timezone';
import * as $ from 'jquery';
import { Router, RouterModule } from '@angular/router';
import { CognitoUtil } from '../../../service/cognito.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
    selector: 'app-slots-calendar',
    templateUrl: './slots-calendar.component.html',
    styleUrls: ['./slots-calendar.component.css']
})
export class SlotsCalendarComponent implements OnInit, OnChanges {
    @Output() slotsCountChange = new EventEmitter<any>();
    @Output() errorOut = new EventEmitter<any>();
    @Output() unauthorizedOut = new EventEmitter<any>();
    @Input() selectedGround;
    @Input() selectedSport;
    @Input() selectedGroundName;
    selectedSlot = new Slot();
    cancellationReason = '';
    selectedReservation = new Reservation();
    slotsCategoryCount = [];
    selectedSlotReservationDetails = {};
    calendarOptions: Options;
    customApprove: boolean;
    public allReservations = [];
    public allGrounds = [];
    public allSports = [];
    unauthorized = false;
    error = false;
    meridian = true;
    events: any;
    showSlotCustomDates: any;
    showScheduleCustomDates: any;
    displayEvent: any;
    firstDay: any;
    selectedPark: any;
    lastDay: any;
    deleteDialog: boolean;
    next_month: string;
    ngStartTime = {};
    ngEndTime = {};
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    f_date: any;
    l_date: any;
    isChangedToSlot = false;
    loadingBar = false;
    isChangedToSchedule = true;
    reservationSelect = [];
    scheduleDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    repeatDays = {};
    first_day = moment().startOf('month').format('YYYY-MM-DD');
    last_day = moment().endOf('month').format('YYYY-MM-DD');
    editItems = [];

    constructor(public slotsService: SlotsService,
        public cognitoUtil: CognitoUtil,
        public router: Router,
        private messageService: MessageService) { }

    ngOnInit() {
        this.selectedPark = localStorage.getItem('defaultParkName');
        let self = this;
        $(document).on('click', '.fc-prev-button', function () {
            let date1 = $('.fc-center h2');
            let arrFromList = Array.prototype.slice.call(date1);
            let prev_month = arrFromList[0].innerHTML;
            self.datesOfMonth(prev_month)
        });
        $(document).on('click', '.fc-next-button', function () {
            let date1 = $('.fc-center h2');
            let arrFromList = Array.prototype.slice.call(date1);
            let next_month = arrFromList[0].innerHTML;
            self.datesOfMonth(next_month);
        });
        $(document).on('click', '.fc-agendaWeek-button', function () {
            console.log('week button clicked')
            let date = $('.fc-center h2')
            let weekList = Array.prototype.slice.call(date);
            let week = weekList[0].innerHTML;
            self.datesOfMonth(week);
        });
        $(document).on('click', '.fc-month-button', function () {
            console.log('month button clicked')
            let date = $('.fc-center h2')
            let month1 = Array.prototype.slice.call(date);
            let month = month1[0].innerHTML;
            self.datesOfMonth(month);
        });
        $(document).on('click', '.fc-agendaDay-button', function () {
            console.log('day button clicked')
            let date = $('.fc-center h2')
            let day1 = Array.prototype.slice.call(date);
            let day = day1[0].innerHTML;
            console.log('in day ', day)
            self.datesOfMonth(day);
        });

    }
    ngOnChanges() {
        console.log('Inside on changes : Ground change, Ground Id is', this.selectedGround);
        console.log('Inside on changes : Sport change, Sport Id is', this.selectedSport);
        // let currentMonthStart = moment().startOf('month').format('YYYY-MM-DD');
        // let currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD');
        // this.selectedGround;
        // localStorage.getItem('defaultParkId');
        // sessionStorage.getItem('cityId');
        const params = {
            'first_date': this.first_day,
            'last_date': this.last_day
        };
        // this.getSlots(params);
        if (this.selectedGround !== undefined) {
            this.getSlots(params);
        }
    }
    clickButton(model: any) {
        this.displayEvent = model;
    }

    datesOfMonth(month) {
        this.messageService.clear();
        let date = new Date(month),
            y = date.getFullYear(),
            m = date.getMonth();
        if (isNaN(y) && isNaN(m)) {
            let split = month.split(', '[1]);
            if (split[5] === undefined) {
                this.f_date = split[0] + ' ' + split[1] + ' ' + split[4];
                this.l_date = split[0] + ' ' + split[3] + ' ' + split[4];
            } else {
                this.f_date = split[0] + ' ' + split[1] + ' ' + split[5];
                this.l_date = split[3] + ' ' + split[4] + ' ' + split[5];
            }
            console.log('week ', month);
            this.first_day = moment(this.f_date).format('YYYY-MM-DD');
            this.last_day = moment(this.l_date).format('YYYY-MM-DD');
            console.log('week 1st date ', this.first_day);
            console.log('week 2nd date ', this.last_day);
            // const params = {
            //     'first_date' : this.first_day,
            //     'last_date' : this.last_day
            // };
            // this.getSlots(params);
        } else {
            let split = month.split(' ');
            if (split[2] === undefined) {
                this.firstDay = new Date(y, m, 1);
                this.lastDay = new Date(y, m + 1, 0);
                this.first_day = moment(this.firstDay).format('YYYY-MM-DD');
                this.last_day = moment(this.lastDay).format('YYYY-MM-DD');
                console.log('month firstDay ', this.first_day);
                console.log('month lastDay ', this.last_day);
                // const params = {
                //     'first_date' : this.first_day,
                //     'last_date' : this.last_day
                // };
                // this.getSlots(params);
            } else {
                this.firstDay = new Date(month);
                this.first_day = moment(this.firstDay).format('YYYY-MM-DD');
                this.last_day = moment(this.firstDay).format('YYYY-MM-DD');
                console.log('firstDay ', this.first_day);
                console.log('lastDay ', this.last_day);
                // const params = {
                //     'first_date' : this.first_day,
                //     'last_date' : this.last_day
                // };
                // this.getSlots(params);
            }
        }
        const params = {
            'first_date': this.first_day,
            'last_date': this.last_day
        };
        this.getSlots(params);
    }
    eventClick(model: any) {
        model = {
            event: {
                id: model.event.id,
                start: model.event.start,
                end: model.event.end,
                title: model.event.title,
                allDay: model.event.allDay,
                available: model.event.available,
                reserved: model.event.reserved,
                reservation: model.event.reservation,
                Sport_Id: model.event.Sport_Id,
                Ground_Id: model.event.Ground_Id,
                Date: model.event.Date,
                Slot: model.event.Slot,
                Slot_Status: model.event.Slot_Status,
                Schedule_Id: model.event.Schedule_Id,
                Rep_Id: model.event.Rep_Id,
                Rep_Name: model.event.Rep_Name,
                Park_Id: model.event.Park_Id,

                // Open_Date: moment(model.event.Open_Date).format('YYYY-MM-DD'),
                // Close_Date: moment(model.event.Close_Date).format('YYYY-MM-DD'),
                // Open_Date: ((model.event.Open_Date).split('T'))[0],
                // Close_Date: ((model.event.Close_Date).split('T'))[0],
                Open_Date: model.event.Open_Date,
                Close_Date: model.event.Close_Date,
                Slot_Category: model.event.Slot_Category,
                Auto_FIFO: model.event.Auto_FIFO
            },
            duration: {}
        };
        console.log('selected calender event: ', model);
        if (model.event.reserved === true) {
            // this.loadingBar = true;
            this.cognitoUtil.refresh();
            const params = {
                'slotId': model.event.id,
                'cityId': sessionStorage.getItem('cityId'),
                'authorizationToken': sessionStorage.getItem('authorizationToken')
            };
            this.loadingBar = true;
            this.slotsService.getReservationDetails(params).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    if (response.body.length === 0) {
                        this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'No reservations exist' });
                        this.loadingBar = false;
                    } else {
                        console.log('this is the data', response.body[0]);
                        this.selectedSlotReservationDetails = {
                            'email': response.body[0].Email,
                            'phoneNumber': response.body[0].Phone_Number,
                            'name': response.body[0].First_Name + ' ' + response.body[0].Last_Name
                        };
                        this.loadingBar = false;
                    }
                }
            },
                err => { this.errorHandle(err) });
        } else if (model.event.reservation === true) {
            this.loadingBar = true;
            this.cognitoUtil.refresh();
            const params = {
                'slotId': model.event.id,
                'cityId': sessionStorage.getItem('cityId'),
                'authorizationToken': sessionStorage.getItem('authorizationToken')
            };
            this.slotsService.getReservationRequests(params).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    if (response.body.length === 0) {
                        this.loadingBar = false;
                        this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'No reservations exist' });
                    } else {
                        this.allReservations = response.body;
                        this.loadingBar = false;
                    }
                }
            },
                err => { this.errorHandle(err) });
        }
        this.setSlotOpenDates(model.event.Slot_Category);
        this.selectedSlot['openDate'] = new Date((moment(model.event.Open_Date).add(1, 'days')).format('llll'));
        this.selectedSlot['closeDate'] = new Date((moment(model.event.Close_Date).add(1, 'days')).format('llll'));
        this.selectedSlot['slotCategory'] = model.event.Slot_Category;
        this.selectedSlot['slotId'] = model.event.id;
        this.selectedSlot['sportId'] = model.event.Sport_Id;
        this.selectedSlot['oldSportId'] = model.event.Sport_Id;
        this.selectedSlot['sport'] = model.event.title;
        this.selectedSlot['groundId'] = model.event.Ground_Id;
        this.selectedSlot['date'] = model.event.Date;
        this.selectedSlot['oldDate'] = model.event.Date;
        // let startValue = new Date(model.event.start
        this.selectedSlot['startDate'] = new Date(new Date(model.event.start.toISOString()).setHours(0));
        // let d = new Date(model.event.start);
        // this.selectedSlot['startDate'] = d.toISOString(); // d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
        this.selectedSlot['endDate'] = new Date(model.event.end);
        this.selectedSlot['slot'] = model.event.Slot;
        this.selectedSlot['oldSlot'] = model.event.Slot;
        this.selectedSlot['slotStatus'] = model.event.Slot_Status;
        this.selectedSlot['scheduleId'] = model.event.Schedule_Id;
        this.selectedSlot['repId'] = model.event.Rep_Id;
        this.selectedSlot['parkId'] = model.event.Park_Id;
        this.selectedSlot['repName'] = model.event.Rep_Name;
        this.selectedSlot['startTime'] = (this.selectedSlot['slot'].split(' - '))[0];
        this.selectedSlot['autoFIFO'] = JSON.parse(model.event.Auto_FIFO);
        // this.selectedSlot['startTime'] = moment(model.event.start).format('hh:mm A');
        // this.selectedSlot['endTime'] = moment(model.event.end).format('hh:mm A');
        this.selectedSlot['endTime'] = (this.selectedSlot['slot'].split(' - '))[1];
        let startHour, endHour;
        // if (this.selectedSlot['startTime'].split(':')[0] === '12' && this.selectedSlot['startTime'].split(' ')[1] === 'AM') {
        //     startHour = '00';
        // } else {
        console.log('this is the 24 hour format time:', this.selectedSlot['startTime']);
        startHour = (moment(this.selectedSlot['startTime'], ["h:mm A"]).format('HH:mm')).split(':')[0];
        // }

        // if (this.selectedSlot['endTime'].split(':')[0] === '12' && this.selectedSlot['endTime'].split(' ')[1] === 'AM') {
        //     endHour = '00';
        // } else {
        endHour = (moment(this.selectedSlot['endTime'], ["h:mm A"]).format('HH:mm')).split(':')[0]
        // }
        // console.log('sttime si: ', stTime, (stTime.split(':')[0] === 12 && stTime.split(' ')[1] === 'AM') ? '00' : stTime );
        this.ngStartTime = {
            hour: startHour,
            // hour: moment(model.event.start).format('hh:mm A').split(':')[0],
            minute: ((this.selectedSlot['startTime']).split(':')[1]).split(" ")[0]
        };

        this.ngEndTime = {
            hour: endHour,
            minute: ((this.selectedSlot['endTime']).split(':')[1]).split(" ")[0]
        };
        // this.selectedSlot['endTime'] = (new Date(model.event.start))+'';
        // console.log("this is the end time:", this.selectedSlot['endDate']);
        // let a = moment(this.selectedSlot['endDate']);
        // console.log("this is the end time a:", a);
        // console.log("this is the end time formated a:", moment.tz(this.selectedSlot['endDate'], 'America/Los_Angeles').format('YYYY-MM-DD hp mm z') );
        this.repeatDays['MON'] = false;
        this.repeatDays['TUE'] = false;
        this.repeatDays['WED'] = false;
        this.repeatDays['THU'] = false;
        this.repeatDays['FRI'] = false;
        this.repeatDays['SAT'] = false;
        this.repeatDays['SUN'] = false;
        console.log('this is the selected selectedSlot', this.selectedSlot);
        if (model.event.available) {
            document.getElementById('available-slot').click();
        } else if (model.event.reserved) {
            document.getElementById('reserved-slot').click();
        } else if (model.event.reservation) {
            document.getElementById('reservation-slot').click();
        } else {
            document.getElementById('cancel-slot').click();
        }
    }
    // onclickCancel() {
    //     // document.getElementById('#cancelGroup').click();
    //     console.log('in on Click cancel')
    // }
    // checkDates(){
    //     if(new Date(this.selectedSlot['startTime'])<new Date(this.selectedSlot['endTime'])) {
    //         this.error={isError:true,errorMessage:'End Date cant before start date'};
    //         }
    // }
    customButton() {
        this.customApprove = true;
    }
    setSlotOpenDates(params) {
        if (params !== 'custom') {
            this.showSlotCustomDates = false;
        } else {
            this.showSlotCustomDates = true;
        }
    }
    setScheduleOpenDates(params) {
        if (params !== 'custom') {
        this.showScheduleCustomDates = false; } else {
            this.showScheduleCustomDates = true;
        }
        // this.createSchedule.scheduleCategory = params;
        // console.log('This is the slot open category', this.createSchedule.scheduleCategory);
    }
    getSlots(dataIn) {
        // $('#loadingModal').modal('show');
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('Selected ground is: ', this.selectedGroundName);
        console.log('slot dates:', dataIn);
        if (this.selectedGroundName !== undefined) {
            if (this.selectedSport === '' || this.selectedSport === undefined) {
                const params = {
                    'startDate': dataIn.first_date,
                    'endDate': dataIn.last_date,
                    'authorizationToken': sessionStorage.getItem('authorizationToken'),
                    'parkId': localStorage.getItem('defaultParkId'),
                    'cityId': sessionStorage.getItem('cityId'),
                    'groundId': this.selectedGround
                };
                console.log('Input to get slots are', params);
                const slotsSummary = {};
                this.slotsService.getSlots(params).subscribe(response => {
                    console.log('The response is', response);
                    if (response.status === 200) {
                        if (response.body.length === 0) {
                            this.events = [];
                            this.loadingBar = false;
                            console.log('at first');
                            this.messageService.add({ severity: 'info', summary: 'Slots Update', detail: 'No slots to display' });
                            // $('#loadingModal').modal('hide');
                            this.calendarOptions = {
                                editable: true,
                                eventLimit: false,
                                header: {
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'month,agendaWeek,agendaDay,listMonth'
                                },
                                events: response.body,
                            };
                            // alert('No slots are available');
                        } else {
                            // this.calendarOptions = {};
                            this.calendarOptions = {
                                editable: true,
                                eventLimit: false,
                                header: {
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'month,agendaWeek,agendaDay,listMonth'
                                },
                                events: response.body,
                            };
                            this.events = response.body;
                            let availableCount = 0;
                            let reservedCount = 0;
                            let requestedCount = 0;
                            let canceledCount = 0;
                            for (let i = 0; i < response.body.length; ++i) {
                                if (response.body[i]['available'] === true) {
                                    availableCount++;
                                } else if (response.body[i]['reservation'] === true) {
                                    requestedCount++;
                                } else if (response.body[i]['reserved'] === true) {
                                    reservedCount++;
                                } else {
                                    canceledCount++;
                                }
                            }
                            slotsSummary['availableCount'] = availableCount;
                            slotsSummary['reservedCount'] = reservedCount;
                            slotsSummary['requestedCount'] = requestedCount;
                            slotsSummary['canceledCount'] = canceledCount;
                            this.slotsCountChange.emit(slotsSummary);
                        }
                        this.loadingBar = false;
                    }
                },
                    err => { this.errorHandle(err) });
                console.log('calender input data: ', this.calendarOptions);
            } else {
                this.loadingBar = true;
                this.cognitoUtil.refresh();
                const params = {
                    'startDate': dataIn.first_date,
                    'endDate': dataIn.last_date,
                    'authorizationToken': sessionStorage.getItem('authorizationToken'),
                    'parkId': localStorage.getItem('defaultParkId'),
                    'cityId': sessionStorage.getItem('cityId'),
                    'groundId': this.selectedGround + '',
                    'sportId': this.selectedSport
                };
                console.log('Input to get slots are', params);
                const slotsSummary = {};
                this.slotsService.getSlots(params).subscribe(response => {
                    console.log('The response is', response);
                    if (response.status === 200) {
                        if (response.body.length === 0) {
                            this.events = [];
                            this.loadingBar = false;
                            console.log('at second');
                            this.messageService.add({ severity: 'info', summary: 'Slots Update', detail: 'No slots to display' });
                        } else {
                            this.events = response.body;
                            let availableCount = 0;
                            let reservedCount = 0;
                            let requestedCount = 0;
                            let canceledCount = 0;
                            for (let i = 0; i < response.body.length; ++i) {
                                if (response.body[i]['available'] === true) {
                                    availableCount++;
                                } else if (response.body[i]['reservation'] === true) {
                                    requestedCount++;
                                } else if (response.body[i]['reserved'] === true) {
                                    reservedCount++;
                                } else {
                                    canceledCount++;
                                }
                            }
                            slotsSummary['availableCount'] = availableCount;
                            slotsSummary['reservedCount'] = reservedCount;
                            slotsSummary['requestedCount'] = requestedCount;
                            slotsSummary['canceledCount'] = canceledCount;
                            this.slotsCountChange.emit(slotsSummary);
                        }
                        this.loadingBar = false;
                    }
                },
                    err => { this.errorHandle(err) });
                console.log('reservations are: ', this.calendarOptions);
            }
        }
    }
    errorHandle(err) {
        if (err.status === 401) {
            this.loadingBar = false;
            this.unauthorized = true;
            this.unauthorizedOut.emit(this.unauthorized)
            // this.router.navigate(['/admin/unauthorized']);
        } else if (err.status === 400 || err.status === 404 || err.status === 500) {
            this.loadingBar = false;
            this.error = true;
            this.errorOut.emit(this.error)
            // this.router.navigate(['/admin/error']);
        } else {
            this.loadingBar = false;
            this.error = true;
            this.errorOut.emit(this.error)
            // this.router.navigate(['/admin/error']);
        }
    }
    closeEdit() {
        this.selectedSlot = new Slot();
        $("#radio1").prop("checked", false);
        $("#radio2").prop('checked', false);
    }
    getSportsByGround() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        this.allSports = [];
        console.log('ground id to get sports', this.selectedGround);
        // console.log('get sports for', inputParams);
        this.selectedSport = '';
        const params = {
            'groundId': this.selectedGround,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        this.slotsService.getSports(params).subscribe(response => {
            console.log('The response is', response);
            // this.allSports = [];
            if (response.status === 200) {
                this.allSports = [];
                if (response.body.length === 0) {
                    this.messageService.add({ severity: 'warn', summary: 'Grounds Update', detail: 'No sports in selected ground' });
                    this.loadingBar = false;
                } else {
                    response.body.forEach((o) => {
                        console.log(o);
                        // let obj = new Sport();
                        const temp = {};
                        temp['value'] = o.Sport_Id;
                        temp['label'] = o.Sport_Name;
                        this.allSports.push(temp);
                    });
                    this.loadingBar = false;
                    console.log('sportList data is: ', this.allSports);
                }
            }
        },
            err => { this.errorHandle(err) });
    }
    editSlot(dataIn) {
        // $('.asgn_prsn_slct label').removeClass('background_none');
        document.getElementById('close-button4').click();
        document.getElementById('close-button3').click();
        document.getElementById('close-button').click();
        console.log('Edit slot', dataIn);
        // data._scheduleId = '';
        this.getSportsByGround();
        if (dataIn._scheduleId === '' || dataIn._scheduleId === undefined || dataIn._scheduleId === null) {
            // this.slotsService.getSlot(params).subscribe( data => {
            //     console.log('Slot service call data: ', data);
            // });
            document.getElementById('edit-slot').click();
        } else {
            document.getElementById('edit-slot-conformation').click();
        }
    }
    onSelectionSlot() {
        this.isChangedToSlot = true;
        this.isChangedToSchedule = false;
        // this.selectedSlot['startDate'] = new Date((this.selectedSlot['startDate']).split('T')[0]);
        // this.selectedSlot['startDate'].setDate(this.selectedSlot['startDate'].getDate() + 1);
    }
    onSelectionSchedule(dataIn, type) {
        this.isChangedToSlot = false;
        this.isChangedToSchedule = true;
        if (type === 'edit') {
            this.loadingBar = true;
            const params = {
                'scheduleId': dataIn.scheduleId,
                'cityId': sessionStorage.getItem('cityId'),
                'authorizationToken': sessionStorage.getItem('authorizationToken')
            };
            this.slotsService.getScheduleDetails(params).subscribe(response => {
                console.log('The response is', response);
                if (response.status === 200) {
                    this.setScheduleOpenDates(response.body[0].Schedule_Category);
                    this.loadingBar = true;
                    this.selectedSlot['startDate'] = new Date(new Date(response.body[0].Start_Date).toISOString());
                    // this.selectedSlot['startDate'] = new Date((response.body[0].Start_Date.split('T'))[0]);
                    // this.selectedSlot['startDate'].setDate(this.selectedSlot['startDate'].getDate() + 1);
                    // this.selectedSlot['startDate'] = moment(data[0].Start_Date).format('YYYY-MM-DD');
                    let d = new Date(this.selectedSlot['startDate']);
                    console.log('this is the selected start before format:', this.selectedSlot['startDate']);
                    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
                    this.selectedSlot['startDate'] = d;
                    console.log('this is the selected start after format:', this.selectedSlot['startDate']);
                    this.selectedSlot['endDate'] = new Date(new Date(response.body[0].End_Date).toISOString());
                    let e = new Date(this.selectedSlot['endDate']);
                    console.log('this is the selected start before format:', this.selectedSlot['endDate']);
                    e.setMinutes(e.getMinutes() + e.getTimezoneOffset());
                    this.selectedSlot['endDate'] = e;
                    console.log('this is the selected start after format:', this.selectedSlot['endDate']);
                    // this.selectedSlot['endDate'] = new Date( (response.body[0].End_Date.split('T'))[0] );
                    // this.selectedSlot['endDate'].setDate(this.selectedSlot['endDate'].getDate() + 1);
                    // let startDate = (data[0].Start_Date).toString();
                    // let currentDateString = (new Date()).toString();
                    // this.selectedSlot['startDate'] = new Date(startDate.substr(0, startDate.indexOf('T'))
                    // + currentDateString.substr(currentDateString.lastIndexOf('T')));
                    this.selectedSlot['scheduleCategory'] = response.body[0].Schedule_Category;
                    this.selectedSlot['openBefore'] = response.body[0].Open_Before;
                    this.selectedSlot['closeBefore'] = response.body[0].Close_Before;
                    this.selectedSlot['slot'] = response.body[0].Slot;
                    this.selectedSlot['startTime'] = (this.selectedSlot['slot'].split(' - '))[0];
                    this.selectedSlot['endTime'] = (this.selectedSlot['slot'].split(' - '))[1];
                    let startHour, endHour;
                    // if (this.selectedSlot['startTime'].split(':')[0] === '12' && this.selectedSlot['startTime'].split(' ')[1] === 'AM') {
                    //     startHour = '00';
                    // } else {
                    console.log('this is the 24 hour format time:', this.selectedSlot['startTime']);
                    startHour = (moment(this.selectedSlot['startTime'], ["h:mm A"]).format('HH:mm')).split(':')[0];
                    // }

                    // if (this.selectedSlot['endTime'].split(':')[0] === '12' && this.selectedSlot['endTime'].split(' ')[1] === 'AM') {
                    //     endHour = '00';
                    // } else {
                    endHour = (moment(this.selectedSlot['endTime'], ["h:mm A"]).format('HH:mm')).split(':')[0]
                    // }
                    // console.log('sttime si: ', stTime, (stTime.split(':')[0] === 12 && stTime.split(' ')[1] === 'AM') ? '00' : stTime );
                    this.ngStartTime = {
                        hour: startHour,
                        // hour: moment(model.event.start).format('hh:mm A').split(':')[0],
                        minute: ((this.selectedSlot['startTime']).split(':')[1]).split(" ")[0]
                    };

                    this.ngEndTime = {
                        hour: endHour,
                        minute: ((this.selectedSlot['endTime']).split(':')[1]).split(" ")[0]
                    };
                    let days = JSON.parse(response.body[0].Days);
                    this.repeatDays['MON'] = days.Mon;
                    this.repeatDays['TUE'] = days.Tue;
                    this.repeatDays['WED'] = days.Wed;
                    this.repeatDays['THU'] = days.Thu;
                    this.repeatDays['FRI'] = days.Fri;
                    this.repeatDays['SAT'] = days.Sat;
                    this.repeatDays['SUN'] = days.Sun;
                    this.loadingBar = false;
                    this.isChangedToSchedule = true;
                    this.isChangedToSlot = false;
                    // console.log("These are the selected schedule values" +
                    // JSON.stringify(this.selectedSlot) + "repeat Days" ,this.repeatDays);
                    // this.loadingBar = false;
                    // this.messageService.add({severity: 'warn', summary:
                    // 'Schedules Update', detail: 'Schedule updated successfully'});
                }
            },
                err => { this.errorHandle(err) });
        }
    }
    confirmEdit(dataIn) {
        this.cognitoUtil.refresh();
        if (this.isChangedToSchedule === true) {
            console.log('scheduleId is', this.selectedSlot);
            // service call for Slot Schedule data
            // this.slotsService.editSchedule(params).subscribe(data => {
            //     console.log('SlotBySchedule service call data: ', data);
            // });
            document.getElementById('edit-schedule').click();
        } else if (this.isChangedToSlot === true) {
            console.log('slot details', dataIn)
            const params = { 'slotId': dataIn.slotId, };
            // service call for Slot data
            // this.slotsService.editSlot(params).subscribe(data => {
            //     console.log('Slot service call data: ', data);
            // });
            document.getElementById('edit-slot').click();
        }
        $("#radio1").prop("checked", false);
        $("#radio2").prop('checked', false);
    }

    // editSlotModel(){
    //     if ($("#radio1").prop("checked")) {
    //         alert("hellooo 1")
    //     }else if ($("#radio2").prop("checked")) {
    //         alert("hellooo 2")
    //     }

    //     var radio1 = document.getElementById('radio1').checked();
    //     alert("r1 : ",radio1)
    // }

    deleteSlotOptions(params) {
        document.getElementById('close-button').click();
        document.getElementById('close-button4').click();
        document.getElementById('close-button3').click();
        document.getElementById('close-button1').click();
        // console.log('Delete this slot', params);
        if (params.scheduleId === '' || params.scheduleId === undefined || params.scheduleId === null) {
            console.log('Delete Object - No Schedule', params);
            // this.slotsService.deleteSlot(params._slotId).subscribe(data => {
            // });
            document.getElementById('delete-slot').click();
        } else {
            console.log('Delete Object', params);
            // this.slotsService.deleteSlotbySchedule(params._scheduleId).subscribe(data => {
            // });
            document.getElementById('delete-slot-conformation').click();
        }
    }

    confirmDelete(params) {
        if (this.isChangedToSchedule === true) {
            console.log('schedule')
            document.getElementById('delete-schedule').click();
        } else if (this.isChangedToSlot === true) {
            console.log('slot')
            document.getElementById('delete-slot').click();
        }
    }

    deleteSlot(params) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        document.getElementById('close-button').click();
        document.getElementById('close-button4').click();
        document.getElementById('close-button3').click();
        document.getElementById('close-button1').click();
        // this.slotsService.deleteSlot(params._slotId).subscribe(data => {
        console.log('Delete this slot', params);
        const paramsOut = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotId': params.slotId,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
        };
        this.slotsService.deleteSlot(paramsOut).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                if (response.body.msg === 'Slot deleted successfully. No associated reservation requests!') {
                    this.loadingBar = false;
                    this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Deleted successfully' });
                    this.reloadSlots();
                } else if (response.body.msg === 'Slot deleted successfully. Sent notification to all reservation requesters!') {
                    this.loadingBar = false;
                    this.messageService.add({
                        severity: 'success', summary: 'Slots Update',
                        detail: 'Deleted successfully, sent notifications'
                    });
                    this.reloadSlots();
                }
            } else if (response.status === 201) {
                if (response.body.msg === 'Slot deleted successfully. Unable to send notification to reservation requesters!') {
                    this.messageService.add({
                        severity: 'warn', summary: 'Slots Update',
                        detail: 'Deleted successfully, error sending notifications'
                    });
                    this.loadingBar = false;
                    this.reloadSlots();
                }
            }
        },
            err => { this.errorHandle(err) });
    }
    reloadSlots() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        const slotParams = {
            'first_date': this.first_day,
            'last_date': this.last_day,
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'parkId': localStorage.getItem('defaultParkId'),
            'cityId': sessionStorage.getItem('cityId'),
            'groundId': this.selectedGround,
        };
        console.log("These are the slot params:", slotParams);
        this.loadingBar = false;
        this.getSlots(slotParams);
    }
    deleteSchedule(params) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        document.getElementById('close-button').click();
        document.getElementById('close-button4').click();
        document.getElementById('close-button3').click();
        document.getElementById('close-button1').click();
        console.log('Delete this schedule', params);
        const paramsOut = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'scheduleId': params.scheduleId,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
        };
        this.slotsService.deleteSlotSchedule(paramsOut).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.reloadSlots();
                this.messageService.add({ severity: 'success', summary: 'Schedules Update', detail: 'Deleted Successfully' });
                // console.log("this is the this.dates::::", this.first_day);
                // console.log("this is the this.dates::::", this.last_day);
            } else if (response.status === 201) {
                this.loadingBar = false;
                this.reloadSlots();
                this.messageService.add({ severity: 'warn', summary: 'Schedules Update', detail: 'Deleted successfully! Unable to delete associated slots.' });
            }
        },
            err => { this.errorHandle(err) });
    }
    cancelSlot(paramsIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        document.getElementById('close-button').click();
        document.getElementById('close-button4').click();
        document.getElementById('close-button3').click();
        console.log('Cancel this slot', paramsIn);
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotId': paramsIn.slotId,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
            'cancellationReason': this.cancellationReason
        };
        this.slotsService.cancelSlot(params).subscribe(response => {
            this.cancellationReason = '';
            console.log('The response is', response);
            if (response.status === 200) {
                // this.router.navigate(['/admin']);
                // this.router.navigate(['/admin/slots']);
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Cancelled successfully' });
                this.reloadSlots();
                // console.log("this is the this.dates::::", this.first_day);
                // console.log("this is the this.dates::::", this.last_day);
            } else if (response.status === 201) {
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Slots Update', detail: 'Cancelled successfully. Unable to send notification to reservation requesters!'
                });
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }
    reactivateSlot(paramsIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        document.getElementById('close-button1').click();
        console.log('Reactivate this slot', paramsIn);
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotId': paramsIn.slotId,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
        };
        this.slotsService.reactivateSlot(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Reactivated Slot, Notifications sent!' });
                this.reloadSlots();
            } else if (response.status === 201) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'warn', summary: 'Slots Update', detail: 'Reactivated Slot, Unable to send notifications!' });
                this.reloadSlots();
            } else if (response.status === 202) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Reactivated Slot!' });
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }
    resetReservations(paramsIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        document.getElementById('close-button4').click();
        console.log('Reset reservations for this slot', paramsIn);
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotId': paramsIn.slotId,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
        };
        this.slotsService.resetReservations(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Reservations successfully reset!' });
                this.reloadSlots();
            } else if (response.status === 201) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'warn', summary: 'Slots Update', detail: 'Reservations successfully reset, Unable to send notifications!' });
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }

    onclickEditSlot() {
        document.getElementById('edit-slot').click();
    }
    updateEvent(model: any) {
        model = {
            event: {
                id: model.event.id,
                start: model.event.start,
                end: model.event.end,
                title: model.event.title
                // other params
            },
            duration: {
                _data: model.duration._data
            }
        }
        this.displayEvent = model;
    }
    // slot update
    updateSlot(dataIn, startTime, endTime) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('data', dataIn)
        document.getElementById('close-button2').click();
        // let startTime = moment(dataIn.startTime).format('hh:mm A');
        // let endTime = moment(dataIn.endTime).format('hh:mm A');
        // let slotStartTime = isNaN(parseInt(startTime)) ? dataIn.startTime : startTime;
        // let slotEndTime = isNaN(parseInt(endTime)) ? dataIn.endTime : endTime;
        // let slot = `${slotStartTime} - ${slotEndTime}`;
        let slot = moment(startTime['hour'] + ':' + startTime['minute'], ['HH:mm']).format("hh:mm A") + ' - ' + moment(endTime['hour'] + ':' + endTime['minute'], ['HH:mm']).format("hh:mm A");
        let sDate = moment(dataIn.startDate).format('YYYY-MM-DD');
        let oDate = moment(dataIn.oldDate).format('YYYY-MM-DD');
        let openDate = moment(dataIn.openDate).format('YYYY-MM-DD');
        let closeDate = moment(dataIn.closeDate).format('YYYY-MM-DD');
        const params = {
            'slotId': dataIn.slotId,
            'newSportId': dataIn._sportId,
            'oldSportId': dataIn.oldSportId,
            'groundId': dataIn._groundId,
            'repId': dataIn.repId,
            'newTime': slot,
            'oldTime': dataIn.oldSlot,
            'newDate': sDate,
            'oldDate': oDate,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotCategory': dataIn.slotCategory,
            'openDate': openDate,
            'closeDate': closeDate,
            'autoFIFO': dataIn.autoFIFO
        };
        console.log('update slot data', params);
        this.slotsService.editSlot(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Slots Update', detail: 'Slot updated successfully' });
                this.reloadSlots();
            } else if (response.status === 201) {
                this.messageService.add({ severity: 'warn', summary: 'Slots Update', detail: 'Unable to update slot, overlap with slot: ' + response.body.overlapSlot[0].Slot });
                this.loadingBar = false;
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }
    // schedule update
    cancelEditSchedule() {
        this.loadingBar = false;
    }
    updateSchedule(data, startTime, endTime) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        document.getElementById('close-button9').click();
        // let a = moment(startTime['hour']+':'+startTime['minute'], ['HH:mm']).format("hh:mm A");
        console.log('Start and End times are', moment(startTime['hour'] + ':' + startTime['minute'], ['HH:mm']).format("hh:mm A") + ',,,,' + moment(endTime['hour'] + ':' + endTime['minute'], ['HH:mm']).format("hh:mm A"));
        // let startTime = moment(data.startTime).format('hh:mm A'); JSON.stringify(startTime)
        // let endTime = moment(data.endTime).format('hh:mm A');
        // let slotStartTime = isNaN(parseInt(startTime)) ? data.startTime : startTime;
        // let slotEndTime = isNaN(parseInt(endTime)) ? data.endTime : endTime;
        let slot = moment(startTime['hour'] + ':' + startTime['minute'], ['HH:mm']).format("hh:mm A") + ' - ' + moment(endTime['hour'] + ':' + endTime['minute'], ['HH:mm']).format("hh:mm A");
        let sDate = moment.utc(data.startDate).format('YYYY-MM-DD');
        let eDate = moment(data.endDate).format('YYYY-MM-DD');
        let daysSelected = { 'Mon': this.repeatDays['MON'], 'Tue': this.repeatDays['TUE'], 'Wed': this.repeatDays['WED'], 'Thu': this.repeatDays['THU'], 'Fri': this.repeatDays['FRI'], 'Sat': this.repeatDays['SAT'], 'Sun': this.repeatDays['SUN'] };
        console.log('these are the selected formated days:', daysSelected);
        // this.selectedSlot['scheduleCategory'] = response.body[0].Schedule_Category;
        //             this.selectedSlot['openBefore'] = response.body[0].Open_Before;
        //             this.selectedSlot['closeBefore']
        const params = {
            'scheduleCategory': data.scheduleCategory,
            'openBefore': data.openBefore,
            'closeBefore': data.closeBefore,
            'autoFIFO': data.autoFIFO,
            'scheduleId': data.scheduleId,
            'sportId': data._sportId,
            'groundId': data._groundId,
            'repId': data.repId,
            'slot': slot,
            'startDate': sDate,
            'endDate': eDate,
            'days': JSON.stringify(daysSelected),
            'parkId': data.parkId,
            'cityId': sessionStorage.getItem('cityId'),
            'authorizationToken': sessionStorage.getItem('authorizationToken')
        };
        console.log('update schedule data', params)
        this.slotsService.scheduleUpdate(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Schedule Update', detail: 'Slot updated successfully' });
                this.reloadSlots();
            } else if (response.status === 201) {
                this.messageService.add({ severity: 'warn', summary: 'Schedule Update', detail: 'Unable to update schedule, overlap with slot: ' + response.body.overlapSlot[0].Slot });
                this.loadingBar = false;
                this.reloadSlots();
            } else if (response.status === 202) {
                this.messageService.add({ severity: 'warn', summary: 'Schedule Update', detail: 'Selected days not present in date range' });
                this.loadingBar = false;
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }
    // assign popup call
    gotoAssign() {
        document.getElementById('close-button3').click();
        document.getElementById('assign-slots').click();
    }
    assignFifo() {
        document.getElementById('assign-slot-popup').click();
        document.getElementById('assign-fifo').click();
    }
    selectedFIFOReservation(paramsIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('this is the selected reservation fifo', paramsIn);
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotId': paramsIn[0].Slot_Id,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
        };
        this.slotsService.assignSlotFifo(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Reservations Update', detail: 'Reservations are processed successfully' });
                this.reloadSlots();
            } else if (response.status === 201) {
                this.messageService.add({ severity: 'warn', summary: 'Reservations Update', detail: 'Reservations are processed successfully, error sending notification!' });
                this.loadingBar = false;
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }
    assignRandom() {
        document.getElementById('assign-slot-popup').click();
        document.getElementById('assign-random').click();
    }
    selectedRandomReservation(paramsIn) {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('this is the selected reservation random', paramsIn);
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotId': paramsIn[0].Slot_Id,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
        };
        this.slotsService.assignSlotRandom(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Reservations Update', detail: 'Reservations are processed successfully' });
                this.reloadSlots();
            } else if (response.status === 201) {
                this.messageService.add({ severity: 'warn', summary: 'Reservations Update', detail: 'Reservations are processed successfully, error sending notification!' });
                this.loadingBar = false;
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }
    onAssignSelect(reservation) {
        this.reservationSelect = [];
        if (this.reservationSelect.length === 0) {
            this.reservationSelect.push(reservation)
        }
        console.log('reservation data', this.reservationSelect)
    }
    assignSelected() {
        document.getElementById('assign-slot-popup').click();
        document.getElementById('assign-confirm').click();
        console.log('confirm reservation data')
    }
    reservationSelected() {
        this.loadingBar = true;
        this.cognitoUtil.refresh();
        console.log('selected Confirm reservation', this.reservationSelect[0]);
        const params = {
            'authorizationToken': sessionStorage.getItem('authorizationToken'),
            'slotId': this.reservationSelect[0].Slot_Id,
            'reservationId': this.reservationSelect[0].Reservation_Id,
            'cityId': sessionStorage.getItem('cityId'),
            'repId': localStorage.getItem('repId'),
        };
        this.slotsService.assignCustomSlot(params).subscribe(response => {
            console.log('The response is', response);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({ severity: 'success', summary: 'Reservations Update', detail: 'Reservations are processed successfully' });
                this.reloadSlots();
            } else if (response.status === 201) {
                this.messageService.add({ severity: 'warn', summary: 'Reservations Update', detail: 'Reservations are processed successfully, error sending notification!' });
                this.loadingBar = false;
                this.reloadSlots();
            }
        },
            err => { this.errorHandle(err) });
    }

    onDaySelection(day) {
        if (this.repeatDays[day] === false) {
            this.repeatDays[day] = true;
        } else {
            this.repeatDays[day] = false;
        }
    }

    calcelSlot() {
        document.getElementById('close-button').click();
        document.getElementById('close-button4').click();
        document.getElementById('close-button3').click();
    }

    reactivateGroup() {
        document.getElementById('close-button1').click();
        //       }else{
        //           this.repeatDays[day] = false;
        //       }
        //     }
        //     cancelReservation() {
        //       document.getElementById('close-button3').click();
    }
}