import { environment } from './../../../environments/environment';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-top-nav",
  templateUrl: "./top-nav.component.html",
  styleUrls: ["./top-nav.component.css"]
})
export class TopNavComponent implements OnInit {
  somevalue: string = 'https://s3.amazonaws.com/fm-logos/' + environment.logoStage + '/' + sessionStorage.getItem('cityId') + '.png';
  cityName: string;

  constructor() {}

  ngOnInit() {
    this.cityName = sessionStorage.getItem("cityName");
  }
  toggleMenu() {
    console.log("top menu clicked");
  }
  updateUrl(event) {
    console.log('failed url:', this.somevalue);
    this.somevalue = 'https://s3.amazonaws.com/fm-logos/System.png';
    console.log('new url:', this.somevalue);
  }
}
