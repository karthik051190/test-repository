import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()

export class GroundsService {

    constructor(public http: HttpClient) { }

    getGrounds(data): Observable<HttpResponse<any>> {
        console.log('in load grounds service call');
        let params = new HttpParams();
        params = params.append('parkId', data.parkId);
        params = params.append('cityId', data.cityId);
        console.log('Params to get grounds GS:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/groundssports/gsbypark';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    // getGroundsSports(data): Observable<any> {
    //     console.log('in load grounds service call');
    //     let params = new HttpParams();
    //     params = params.append('parkId', data.parkId);
    //     params = params.append('cityId', data.cityId);
    //     console.log('Params to get grounds GS:', params);
    //     let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
    //     const options = { params: params, headers: headers };
    //     const url = environment.apiUrl + '/groundssports/gsbypark';
    //     return this.http.get(url, options);
    // }
    editGround(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('cityId', data.cityId);
        params = params.append('parkId', data.parkId);
        params = params.append('groundId', data.groundId);
        params = params.append('groundName', data.groundName);
        console.log('Params to edit park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/groundssports';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    editGround1(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('cityId', data.cityId);
        params = params.append('parkId', data.parkId);
        params = params.append('groundId', data.groundId);
        params = params.append('sport', data.sport);
        params = params.append('groundName', data.groundName);
        console.log('Params to edit park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/groundssports';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public deleteSport(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('GSId', data.gsId);
        params = params.append('cityId', data.cityId);
        console.log('Params to delete sport from ground:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/groundssports';
        return this.http.delete<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public deleteGround(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('groundId', data.groundId);
        params = params.append('cityId', data.cityId);
        console.log('Params to delete ground:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/grounds';
        return this.http.delete<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public getSports(): Observable<HttpResponse<any>> {
        console.log('in load grounds service call');
        let params = new HttpParams();
        params = params.append('cityId', sessionStorage.getItem('cityId'));
        console.log('Params to get Sports:', params);
        let headers = new HttpHeaders().set('authorizationtoken', sessionStorage.getItem('authorizationToken'));
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/sports';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public addGround(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('groundName', data.groundName);
        params = params.append('sport', data.sport);
        params = params.append('cityId', data.cityId);
        params = params.append('parkId', data.parkId);
        console.log('Params to add park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/grounds';
        return this.http.post<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public addSport(groundId: number, sportName: string): any {

    }
}
