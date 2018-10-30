import { CitiesService } from './../../service/cities.service';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import {TabViewModule} from 'primeng/tabview';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/System.png';
  basicDetails= [];
  advancedDetails= [];
  premiumDetails= [];
  selectble_plans= [];

  constructor(public router: Router,
    public citiesService: CitiesService) { }

  ngOnInit() {
    this.getPlans();
  }
  updateUrl(event) {
    console.log('failed url:', this.somevalue);
    this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
    console.log('new url:', this.somevalue);
  }
  routeToSignUp() {
  this.router.navigate(['home/addCity']);
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
        } else {
          this.premiumDetails.push(
            {'noofParks': response[i].Parks_Limit,
            'groundsperParks': response[i].Grounds_Per_Park,
            'sportsperGround': response[i].Sports_Per_Ground,
            'price': response[i].Price})
        }
      }
    })
  }
}
