import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()
export class AdminsService {

    constructor(public http: HttpClient) { }

    public getAdmins(data): Observable<HttpResponse<any>> {
        let params = new HttpParams().set('cityId', data.cityId);
        console.log('Params to get admins:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/admin';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public checkUsername(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('username', data.username);
        params = params.append('cityId', data.cityId);
        console.log('Params to get admins:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/admin/checkusername';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public parseData = (data) => {
        // console.log.log('Data:', data.json());
        const body = data.json();
        return body || {};
        // return data;
    }

    public handleError = (err) => {
        // console.log.log('error:', err);
        return Observable.throw(err);
    }

    deleteAdmin(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('cityId', data.cityId);
        params = params.append('username', data.username);
        console.log('Params to delete park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/admin';
        return this.http.delete<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public addAdmin(data, data1): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('firstName', data.firstName);
        params = params.append('lastName', data.lastName);
        params = params.append('username', data.username);
        params = params.append('email', data.email);
        params = params.append('phoneNumber', data.phoneNumber);
        params = params.append('permission', data.permission);
        params = params.append('cityId', data1.cityId);
        console.log('Params to add park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data1.authorizationToken);
        const url = environment.apiUrl + '/admin';
        return this.http.post<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public editAdmin(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('firstName', data.firstName);
        params = params.append('lastName', data.lastName);
        params = params.append('username', data.username);
        params = params.append('email', data.email);
        params = params.append('phoneNumber', data.phoneNumber);
        params = params.append('existingPermission', data.existingPermission);
        params = params.append('newPermission', data.newPermission);
        params = params.append('cityId', data.cityId);
        console.log('Params to edit park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/admin';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }

}
