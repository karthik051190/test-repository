import { Component, OnInit } from '@angular/core';
import { CognitoUtil } from '../../service/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  // isActive = true;
  id = 0;
  constructor(public cognitoUtil: CognitoUtil,
    private router: Router) {
    this.cognitoUtil.refresh();
  }

  isActive: string;
  // constructor() { }

  ngOnInit() {
    console.log('side bar component..');
    this.isActive = this.router.url;
  }

  addActive() {
    this.isActive = this.router.url;
    console.log("url ", this.router.url);
  }
}
