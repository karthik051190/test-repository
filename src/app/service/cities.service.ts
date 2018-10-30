import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { City } from '../models/city';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CitiesService {

  constructor(private http: HttpClient) { }

   public plans = [
  {
    "Plan_Id" : 1,
    "Plan_Name" : "Basic",
    "Parks_Limit" : "1",
    "Grounds_Per_Park" : "2",
    "Sports_Per_Ground" : "5",
    "Plan_Status" : "Active",
    "Price" : "$19.99",
    "Edited_By" : null
  },
{
    "Plan_Id" : 2,
    "Plan_Name" : "Advanced",
    "Parks_Limit" : "1",
    "Grounds_Per_Park" : "5",
    "Sports_Per_Ground" : "Unlimited",
    "Plan_Status" : "Active",
    "Price" : "$49.99",
    "Edited_By" : null
  },
  {
    "Plan_Id" : 3,
    "Plan_Name" : "Premium",
    "Parks_Limit" : "Unlimited",
    "Grounds_Per_Park" : "Unlimited",
    "Sports_Per_Ground" : "Unlimited",
    "Plan_Status" : "Active",
    "Price" : "contact",
    "Edited_By" : null
  },
  {
    "Plan_Id" : 4,
    "Plan_Name" : "Pay as you go",
    "Parks_Limit" : "Unlimited",
    "Grounds_Per_Park" : "Unlimited",
    "Sports_Per_Ground" : "Unlimited",
    "Plan_Status" : "Active",
    "Price" : "50cents",
    "Edited_By" : null
  }
];



  public addCity(params): Observable<HttpResponse<any>> {
    console.log("@@@@@@@@@@@@@@@@",params)
    // let headers = new HttpHeaders().set('authorizationtoken', params.authorizationToken);
    console.log(params);
    const url = environment.apiUrl + '/city' + '?cityName=' + params.cityName +'&accountType='+ params.accountType + '&street='+ params.street + '&city='+ params.city + '&state='+ params.state + '&zipCode='+ params.zipCode + '&website='+ params.website + '&domain='+ params.domain + '&firstName='+ params.firstName + '&lastName='+ params.lastName + '&phoneNumber='+ params.phoneNumber + '&email='+ params.email + '&username='+ params.username + '&planId='+ params.planId + '&parksLimit='+ params.parksLimit + '&groundsPerPark='+ params.groundsPerPark + '&sportsPerGround='+ params.sportsPerGround + '&price='+ params.price + '&createdAt='+ params.createdAt;
    console.log("this is url::",url);
    return this.http.post<any>(url, '', {observe: 'response'});
  }
  public getCity(): Observable<HttpResponse<any>> {
    const url = environment.apiUrl + '/city';
    return this.http.get<any>(url, {observe: 'response'});
  }
  public getCityDetails(params): Observable<HttpResponse<any>> {
    // let headers = new HttpHeaders().set('authorizationtoken', params.authorizationToken);
    console.log(params);
    const url = environment.apiUrl + '/city/bydomainname' + '?cityDomain=' + params;
    return this.http.get<any>(url, { observe: 'response' });
  }

   getPlans = function(): any {
    return new Promise((resolve, reject) => {
      resolve(this.plans);
    });
  }
}
