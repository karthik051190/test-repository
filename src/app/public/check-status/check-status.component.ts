import { UserFormService } from './../../service/user-form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Component, OnInit, asNativeElements } from '@angular/core';

@Component({
  selector: 'app-check-status',
  templateUrl: './check-status.component.html',
  styleUrls: ['../../../assets/slotsAssets/css/style.css']
})
export class CheckStatusComponent implements OnInit {
  somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
  cityName: string;
  address: string;
  website: string;
  loadingBar = false;
  reservationNumber: string;
  errorMessage: string;
  applicantName: string;
  teamName: string;
  residentOf: string;
  email: string;
  phoneNumber: string;
  parkName: string;
  groundName: string;
  date: string;
  slot: string;
  slotStatus: string;
  slotStatusMenu: boolean = false;
  noSlotsMenu: boolean = false;
  responseEmail: string;


  constructor(public router: Router,
    private route: ActivatedRoute,
    public userformService: UserFormService) {
    this.cityName = sessionStorage.getItem('cityName');
        this.address = sessionStorage.getItem('address');
        this.website = sessionStorage.getItem('website');
        console.log('Check Status constructor');
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if ( params.email !== null && params.email !== undefined && params.reservationNumber !== null && params.reservationNumber !== undefined ) {
        this.email = params.email;
        this.reservationNumber = params.reservationNumber;
        this.onSubmit();
      }
    })
  }
  print() {
    window.print();
  }
  updateUrl(event) {
    console.log('failed url:', this.somevalue);
    this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
    console.log('new url:', this.somevalue);
  }
  onSubmit() {
    console.log('This is the input ', this.email, this.reservationNumber);
    this.loadingBar = true;
        this.userformService.getReservationStatus(this.email, this.reservationNumber).subscribe((data) => {
          console.log('this is the service call response: ', data);
          if (data.length === 0) {
            // setTimeout(() => {
              console.log('this is the service call response: ', data);
                this.loadingBar = false;
            // }, 3000);
            this.slotStatusMenu = false;
            this.noSlotsMenu = true;
        } else {
          this.slotStatusMenu = true;
          this.applicantName = data[0]['userName'];
          this.teamName = data[0]['Team_Name'];
          this.residentOf = data[0]['Resident_Of'];
          this.responseEmail = data[0]['Email'];
          this.phoneNumber = data[0]['Phone_Number'];
          this.parkName = data[0]['Park_Name'];
          this.groundName = data[0]['Ground_Name'];
          this.date = data[0]['Reservation_Date'];
          this.date = this.date.split('T')[0];
          this.slot = data[0]['Slot'];
          this.slotStatus = data[0]['Reservation_Status'];
          // this.processedBy = data[0]['repName'];
          this.loadingBar = false;
          this.noSlotsMenu = false;
        }
      });
  }
}
