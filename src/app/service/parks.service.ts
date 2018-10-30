import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Config } from 'codelyzer';

@Injectable()
export class ParksService {
    constructor(private http: HttpClient) { }
    public getParksListDefaults(data): Observable<HttpResponse<any>> {
        let params = new HttpParams().set('cityId', data.cityId);
        console.log('Params to get parks:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        // const options = {observe: 'response', params: params, headers: headers};
        const url = environment.apiUrl + '/parks/parksbycity';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public getParks(data): Observable<HttpResponse<any>> {
        let params = new HttpParams().set('cityId', data.cityId);
        console.log('Params to get parks:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        // const options = {observe: 'response', params: params, headers: headers};
        const url = environment.apiUrl + '/parks/parksbycity';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public updateDefaults(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('cityId', data.cityId);
        params = params.append('parkId', data.parkId);
        params = params.append('repId', data.repId);
        console.log('Params to update default park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/admin/defaults';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public deletePark(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('cityId', data.cityId);
        params = params.append('parkId', data.parkId);
        console.log('Params to delete park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/parks';
        return this.http.delete<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public addPark(data, data1): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('parkName', data.parkName);
        params = params.append('address', data.address);
        params = params.append('website', data.website);
        params = params.append('cityId', data1.cityId);
        console.log('Params to add park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data1.authorizationToken);
        const url = environment.apiUrl + '/parks';
        return this.http.post<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public editPark(data, data1): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('parkName', data.parkName);
        params = params.append('parkId', data.parkId);
        params = params.append('address', data.address);
        params = params.append('website', data.website);
        params = params.append('cityId', data1.cityId);
        console.log('Params to edit park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data1.authorizationToken);
        const url = environment.apiUrl + '/parks';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
}
