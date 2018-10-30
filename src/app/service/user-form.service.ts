import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UserFormService {
    headers: any;
    constructor(private http: HttpClient) { }
    getSports(data): Observable<any> {
        // const cityId = data;
        let params = new HttpParams().set('cityId', data);
        // const headers = new HttpHeaders().set('Content-Type', 'application/json');
        // const options = { params: params };
        const url = environment.apiUrl + '/groundssports/sportsbycity';
        return this.http.get(url, { params: params });
    }
    getAdminEMails(): Observable<any> {
        let params = new HttpParams();
        params = params.append('cityId', sessionStorage.getItem('cityId'));
        console.log('these are the service call params for get Slots by Sport and Ground', params);
        const url = environment.apiUrl + '/city/getadminemails';
        return this.http.get(url, { params: params });
    }
    getReservationStatus(email, reservationId): Observable<any> {
        let params = new HttpParams();
        params = params.append('email', email);
        params = params.append('reservationId', reservationId);
        console.log('these are the service call params for get Slots by Sport and Ground', params);
        const url = environment.apiUrl + '/reservations/getstatus';
        return this.http.get(url, { params: params });
    }

    getGrounds(data): Observable<any> {
        let params = new HttpParams();
        // let params = data;
        // Begin assigning parameters
        params = params.append('cityId', data.cityId);
        params = params.append('sportId', data.sportId);
        console.log('these are the service call params for get Grounds by SportId', params);
        const url = environment.apiUrl + '/groundssports/groundsbysportandcity';
        return this.http.get(url, { params: params });
        // const reservationsObj = new Reservation();
        // const url = 'https: //7dxld84l34.execute-api.us-east-1.amazonaws.com/dev/submitschedule';
        // const phone = '+1'.concat(userData.phoneNumber);
        // const params = {
        //     'slotId':  data
        // }

        // console.log('***************New url:  ', params);
        // return this.http.post(url, params).map(this.parseData).catch(this.handleError);
        // let groundsData:  any = [
        //     {
        //       'Ground_Id': 2,
        //         'Ground_Name': 'Leonard Johns #1'
        //     },
        //     {
        //       'Ground_Id': 3,
        //         'Ground_Name': 'Glenwick'
        //     }
        //     ]
        //   return Observable.of(groundsData);
    }
    public getSlotsAvailable(data): Observable<any> {

        let params = new HttpParams();
        // let params = data;

        // Begin assigning parameters
        params = params.append('cityId', data.cityId);
        params = params.append('sportId', data.sportId);
        params = params.append('groundId', data.groundId);
        params = params.append('startDate', data.startDate);
        params = params.append('endDate', data.endDate);
        console.log('these are the service call params for get Slots by Sport and Ground', params);
        const url = environment.apiUrl + '/slots/slotsbygroundandsport';
        return this.http.get(url, { params: params });
    }
    // console.log('get slots params:  ', params);
    // // const url = 'https: //kz7qq1y1c6.execute-api.us-east-1.amazonaws.com/dev/getslots';
    // const url = 'https: //kz7qq1y1c6.execute-api.us-east-1.amazonaws.com/dev/groundapp-insertslots';
    // return this.http.post(url, params).map(this.parseData).catch(this.handleError);
    public submitReservation(data): any {
        let params = new HttpParams();
        params = params.append('phoneNumber', data.phoneNumber);
        params = params.append('slotId', data.slotId);
        params = params.append('slot', data.slot);
        params = params.append('slotFIFO', data.slotFIFO);
        params = params.append('slotStatus', data.slotStatus);
        params = params.append('reservationDate', data.reservationDate);
        params = params.append('cityId', data.cityId);
        params = params.append('groundId', data.groundId);
        params = params.append('sportId', data.sportId);
        params = params.append('createdAt', data.createdAt);
        params = params.append('firstName', data.firstName);
        params = params.append('lastName', data.lastName);
        params = params.append('email', data.email);
        params = params.append('teamName', data.teamName);
        params = params.append('residentOf', data.residentOf);
        params = params.append('stage', data.stage);
        params = params.append('cityDomain', sessionStorage.getItem('cityDomain'));
        console.log('these are the service call params for add Reservations', params);
        const url = environment.apiUrl + '/reservations';
        return this.http.post(url, '', { params: params });
    }
}
