import { environment } from './../../../environments/environment.prod';
import { MenuItem } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { City } from '../../models/city';
import { User } from '../../models/user';
import { Policy } from '../../models/policy';
import { CitiesService } from '../../service/cities.service';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';
import {TabViewModule} from 'primeng/tabview';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddCityComponent implements OnInit {
    somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
  cityData = new City();
  items: MenuItem[];
  activeIndex: number = 0;
  userData = new User();
  policyData = new Policy();
  loadingBar = false;
  addCityForm: FormGroup;
  cityForm: boolean;
  accountDetailsTab: boolean = true;
  userDetailsTab: boolean = false;
  subscriptionTab: boolean = false;
  confirmationTab: boolean = false;
    checkValidation;
    user_checkValidation;
    plan_checkValidation;
    selectble_plans=[];
    accountType= [];
    msgs: Message[] = [];
    basicDetails=[];
    advancedDetails=[];
    premiumDetails=[];
    payasyouGoDetails=[];
    sub_type;
    planData:any;
    tabIndex;

    constructor(private formbuilder: FormBuilder,
        public citiesService: CitiesService,
        private messageService: MessageService) {
        this.cityForm = true;
    }

  ngOnInit() {
    this.items = [{
        label: 'Account Details',
        command: (event: any) => {
            this.activeIndex = 0;
        }
    },
    {
        label: 'User Details',
        command: (event: any) => {
            this.activeIndex = 1;
        }
    },
    {
        label: 'Subscription Plans',
        command: (event: any) => {
            this.activeIndex = 2;
            // this.messageService.add({severity:'info', summary:'Pay with CC', detail: event.item.label});
        }
    },
    {
        label: 'Confirmation',
        command: (event: any) => {
            this.activeIndex = 3;
        }
    }
];
      //this.cityData.accountType = 'City';
      this.accountType.push({label: ' City/Town  ', value: ' City/Town  '});
      this.accountType.push({label: ' Park Manager  ', value: ' Park Manager  '});
      this.accountType.push({label: 'League  ', value: 'League  '});
      this.accountType.push({label: 'Facility  ', value: 'Facility'});
      this.accountType.push({label: 'User  ', value: 'User'});


      this.addCityForm = this.formbuilder.group({
      'cityName': new FormControl('', Validators.required),
      'street': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'zipCode': new FormControl('', Validators.required),
      'website': new FormControl('', Validators.required),
      'domain': new FormControl('', [Validators.pattern(/^[a-zA-Z]*$/), Validators.required]),
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'phoneNumber': new FormControl('', [ Validators.min(1000000000), Validators.max(9999999999), Validators.required]),
      'email': new FormControl('', [Validators.email, Validators.required]),
      'username': new FormControl('', Validators.required),
      'accountType': new FormControl('', Validators.required),
      'planType': new FormControl('', Validators.required),
      'Type': new FormControl('', Validators.required)
    });
      this.msgs = [];
      this.tabIndex=0;
      this.getPlans();
  }

  handleChange(e) {
    var index = e.index;
    if(index==0){
    this.tabIndex=0
    }
    else{
    this.tabIndex=1
    }
  }

  updateUrl(event) {
    console.log('failed url:', this.somevalue);
    this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
    console.log('new url:', this.somevalue);
  }
  getPlans() {
    this.citiesService.getPlans().then(response => {
     console.log('!!!!!!!!!!!!!!! ', response);
     for ( let i = 0; i < response.length; i++) {
        this.selectble_plans.push({label: response[i].Plan_Name, value: response[i]});
        if (response[i].Plan_Name === 'Basic') {
          console.log('11111111111', response[i].Parks_Limit)
          this.basicDetails.push(
              {'noofParks': response[i].Parks_Limit,
              'groundsperParks': response[i].Grounds_Per_Park,
              'sportsperGround': response[i].Sports_Per_Ground,
              'price': response[i].Price
            })
        } else if (response[i].Plan_Name === 'Advanced') {
            this.advancedDetails.push(
                {'noofParks': response[i].Parks_Limit,
                'groundsperParks': response[i].Grounds_Per_Park,
                'sportsperGround': response[i].Sports_Per_Ground,
                'price': response[i].Price})
        } else if(response[i].Plan_Name === 'Premium'){
          this.premiumDetails.push(
            {'noofParks': response[i].Parks_Limit,
            'groundsperParks': response[i].Grounds_Per_Park,
            'sportsperGround': response[i].Sports_Per_Ground,
            'price': response[i].Price})
        }
        else{
          this.payasyouGoDetails.push(
            {'noofParks': response[i].Parks_Limit,
            'groundsperParks': response[i].Grounds_Per_Park,
            'sportsperGround': response[i].Sports_Per_Ground,
            'price': response[i].Price})
        }
      }
    })
  }

  toggleForm() {
    this.cityForm = !this.cityForm;
  }
  onClear() {
      this.addCityForm.reset();
  }
  keyPress(event: any) {
      const pattern = /^[a-zA-Z]*$/;
      let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
        }
    }
    onStepChange(event) {
        console.log('this is the event:', event);
        if (event === 0) {
            this.goToMenu(1);
        }else if (event === 1) {
            this.goToMenu(2);
        }else if (event === 2) {
            this.goToMenu(3);
        }else if (event === 3) {
            this.goToMenu(4);
        }
    }
      goToMenu(param) {
        if (param === 1) {
            this.accountDetailsTab = true;
            this.userDetailsTab = false;
            this.subscriptionTab = false;
            this.confirmationTab = false;
            this.activeIndex = 0;
        } else if (param === 2) {
            if ((this.cityData.cityName === undefined && this.addCityForm.controls['cityName'].status==='INVALID')||(this.cityData.accountType === undefined && this.addCityForm.controls['accountType'].status==='INVALID')||(this.cityData.street === undefined && this.addCityForm.controls['street'].status==='INVALID')||(this.cityData.city === undefined && this.addCityForm.controls['city'].status==='INVALID')||(this.cityData.state === undefined && this.addCityForm.controls['state'].status==='INVALID')||(this.cityData.zipCode === undefined && this.addCityForm.controls['zipCode'].status==='INVALID')||(this.cityData.website === undefined && this.addCityForm.controls['website'].status==='INVALID')||(this.cityData.domain === undefined && this.addCityForm.controls['domain'].status==='INVALID') ||(this.cityData.cityName==="")|| (this.cityData.street==="")||(this.cityData.city==="")|| (this.cityData.state==="")|| (this.cityData.zipCode==="")||(this.cityData.website==="")||(this.cityData.domain==="")||(this.cityData.accountType==="")){
              this.checkValidation = true;
            } else {
            this.accountDetailsTab = false;
            this.userDetailsTab = true;
            this.subscriptionTab = false;
            this.confirmationTab = false;
            this.activeIndex = 1;
            }
        } else if (param === 3) {
           this.sub_type="";
          console.log(this.addCityForm.controls['phoneNumber'],this.userData.phoneNumber)
              if((this.userData.firstName === undefined && this.addCityForm.controls['firstName'].status==='INVALID')||(this.userData.lastName === undefined && this.addCityForm.controls['lastName'].status==='INVALID')||(this.userData.phoneNumber === undefined && this.addCityForm.controls['phoneNumber'].status==='INVALID')||(this.userData.email === undefined && this.addCityForm.controls['email'].status==='INVALID')||(this.userData.username === undefined && this.addCityForm.controls['username'].status==='INVALID') ||(this.userData.firstName==="")||(this.userData.lastName==="")||(this.userData.phoneNumber==="")||(this.userData.email==="")||(this.userData.username==="")||(this.userData.phoneNumber===null)){
              this.user_checkValidation=true;
            } else {
            this.userDetailsTab = false;
            this.accountDetailsTab = false;
            this.subscriptionTab = true;
            this.confirmationTab = false;
            this.activeIndex = 2;
           }
        } else if (param === 4) {

           if($('#sub .ui-tabview-panel').attr('aria-hidden')=="false"){
               this.sub_type="subscription";
           }
           else{
              this.sub_type={
                  "Plan_Id" : 4,
                  "Plan_Name" : "Pay as you go",
                  "Parks_Limit" : "Unlimited",
                  "Grounds_Per_Park" : "Unlimited",
                  "Sports_Per_Ground" : "Unlimited",
                  "Plan_Status" : "Active",
                  "Price" : "50cents",
                  "Edited_By" : null
                };
           }
          if(this.sub_type=="subscription"){
              const params = {
              'cityName': this.cityData.cityName,
              'accountType': this.cityData.accountType,
              'street': this.cityData.street,
              'city': this.cityData.city,
              'state': this.cityData.state,
              'zipCode': this.cityData.zipCode,
              'website': this.cityData.website,
              'domain': this.cityData.domain,
              'firstName': this.userData.firstName,
              'lastName': this.userData.lastName,
              'phoneNumber': this.userData.phoneNumber,
              'email': this.userData.email,
              'username': this.userData.username,
              'planType': this.policyData.policyName,
              'Type': this.sub_type
              }
          }
          else{
             const params = {
              'cityName': this.cityData.cityName,
              'accountType': this.cityData.accountType,
              'street': this.cityData.street,
              'city': this.cityData.city,
              'state': this.cityData.state,
              'zipCode': this.cityData.zipCode,
              'domain': this.cityData.domain,
              'firstName': this.userData.firstName,
              'lastName': this.userData.lastName,
              'phoneNumber': this.userData.phoneNumber,
              'email': this.userData.email,
              'username': this.userData.username,
              'planType': this.sub_type.Plan_Name,
              'Type': "pay as you go"
              }
          }
         
            if (((this.policyData.policyName === undefined && this.addCityForm.controls['planType'].status==='INVALID')||(this.policyData.policyName==="")) && this.sub_type==='subscription') {
                this.plan_checkValidation = true;
            } else {
            this.userDetailsTab = false;
            this.accountDetailsTab = false;
            this.subscriptionTab = false;
            this.confirmationTab = true;
            this.activeIndex = 3;
            this.addCityForm.value.Type=this.sub_type.plan_name;
            }
        }
    }
    onSubmit() {
    this.loadingBar = true;
    const date = new Date();
    // const params = {};

    if (this.sub_type === 'subscription') {
       const params = {
      'cityName': this.cityData.cityName,
      'accountType': this.cityData.accountType,
      'street': this.cityData.street,
      'city': this.cityData.city,
      'state': this.cityData.state,
      'zipCode': this.cityData.zipCode,
      'website': this.cityData.website,
      'domain': this.cityData.domain,
      'firstName': this.userData.firstName,
      'lastName': this.userData.lastName,
      'phoneNumber': this.userData.phoneNumber,
      'email': this.userData.email,
      'username': this.userData.username,
      'planId': this.policyData.policyName['Plan_Id'],
      'parksLimit': this.policyData.policyName['Parks_Limit'],
      'groundsPerPark': this.policyData.policyName['Grounds_Per_Park'],
      'sportsPerGround': this.policyData.policyName['Sports_Per_Ground'],
      'price': this.policyData.policyName['Price'],
      'createdAt': moment(date).format('YYYY-MM-DD hh:mm:ss')
      // 'authorizationToken': sessionStorage.getItem('authorizationToken')
    }
    this.planData = params;
    } else {
      const params = {
      'cityName': this.cityData.cityName,
      'accountType': this.cityData.accountType,
      'street': this.cityData.street,
      'city': this.cityData.city,
      'state': this.cityData.state,
      'zipCode': this.cityData.zipCode,
      'website': this.cityData.website,
      'domain': this.cityData.domain,
      'firstName': this.userData.firstName,
      'lastName': this.userData.lastName,
      'phoneNumber': this.userData.phoneNumber,
      'email': this.userData.email,
      'username': this.userData.username,
      'planId': this.sub_type.Plan_Id,
      'parksLimit': this.sub_type.Parks_Limit,
      'groundsPerPark': this.sub_type.Grounds_Per_Park,
      'sportsPerGround': this.sub_type.Sports_Per_Ground,
      'price': this.sub_type.Price,
      'createdAt': moment(date).format('YYYY-MM-DD hh:mm:ss')
      // 'authorizationToken': sessionStorage.getItem('authorizationToken')
    }
        this.planData = params;
    }
        console.log('Selected plan data:', this.planData);
        this.citiesService.addCity(this.planData).subscribe(response => {
            console.log('The response is', response.body);
            this.goToMenu(1);
            setTimeout(function(){
            $('#cityForm').trigger('reset');
            this.cityData.accountType = '';
            this.cityData.street = '';
            this.cityData.city = '';
            this.cityData.state = '';
            this.cityData.zipCode = '';
            this.cityData.website = '';
            this.cityData.domain = '';
            this.userData.firstName = '';
            this.userData.lastName = '';
            this.userData.phoneNumber = '';
            this.userData.email = '';
            this.userData.username = '';
            this.policyData.policyName = '';
            this.tabIndex = 0;
            }.bind(this), 0);
            if (response.status === 200) {
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'City Request has been submitted!',
                    detail: 'We will notify you via email once it is processed'
                });
                this.onClear();
                setTimeout(() => {
                    this.clearMessages();
                }, 5000);
                alert('City Request has been submitted!, We will notify you via email once it is processed');
            } else if (response.status === 201) {
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: '',
                    detail: 'We encountered an error while submitting your request 201, please contact technical support at 214-206-8976'
                });
                this.onClear();
                setTimeout(() => {
                    this.clearMessages();
                }, 5000);
                alert('We encountered an error while submitting your request 201, please contact technical support at 214-206-8976');
            } else if (response.status === 202) {
                this.loadingBar = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: '',
                    detail: 'We encountered an error while submitting your request 202, please contact technical support at 214-206-8976'
                });
                this.onClear();
                setTimeout(() => {
                    this.clearMessages();
                }, 5000);
                alert('We encountered an error while submitting your request 202, please contact technical support at 214-206-8976');
            }
        }, err => {
            this.onClear();
            this.loadingBar = false;
            this.messageService.add({
                severity: 'warn',
                summary: '',
                detail: 'We encountered an error while submitting your request 400+, please contact technical support at 214-206-8976'
            });
            alert('We encountered an error while submitting your request 400, please contact technical support at 214-206-8976');
        });
    }
    clearMessages() {
        this.msgs = [];
    }


}
