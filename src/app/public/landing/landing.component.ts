import { CitiesService } from './../../service/cities.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {MessageService} from 'primeng/components/common/messageservice';


@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {
  loadingBar = false;
  somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + 'System' + '.png';
  citiesInfo = [];
  public cityData: FormGroup;


  constructor(public router: Router,
    public citiesservice: CitiesService,
    private messageService: MessageService) {
     this.cityData = new FormGroup({
      'city': new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.getCities();
    this.loadingBar = true;
  }
  // routeFM() {
  //   this.router.navigate(['http://chi.dev.fieldsmanager.com/home/land'])
  // }
  updateUrl(event) {
    console.log('failed url:', this.somevalue);
    this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
    console.log('new url:', this.somevalue);
  }
  goToPricing() {
    this.router.navigate(['home/pricing']);
  }
  getCities() {
    this.citiesservice.getCity().subscribe(response => {
      console.log('The response is', response.body);
      if (response.status === 200) {
        this.loadingBar = false;
        let cityArray = response.body;
        for (let i = 0; i < cityArray.length; i++) {
          this.citiesInfo.push({ 'label': cityArray[i].City_Name, 'value': cityArray[i].Domain })
        }
      }
    }, err => {
      console.log('this is the error', err);
      this.loadingBar = false;
      alert('Some unexpected error occured, Please reload the page.\nIf the problem persists, Try again after sometime or contact support.')
    });
  }

  findSlot() {
    console.log(this.cityData)
  let url = 'http://' + this.cityData.value.city + environment.URL;
  window.open(url, '_self');

  }

  public goHome() {
    this.router.navigate(["/home/login"]);
  }
  public addCity() {
    this.router.navigate(["/home/addCity"]);
  }
}


