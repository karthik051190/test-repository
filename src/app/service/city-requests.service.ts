import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CityRequestsService {
  constructor(private http: HttpClient) { }

  public getCityRequests(): Observable<HttpResponse<any>> {
    const url = environment.apiUrl + '/city/requests';
    let headers = new HttpHeaders().set('authorizationtoken', sessionStorage.getItem('authorizationToken'));
    return this.http.get<any>(url, { observe: 'response', headers: headers });
  }

  public acceptRequest(data): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    params = params.append('cityId', data.cityId);
    console.log('Params to accept city request:', params);
    let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
    const url = environment.apiUrl + '/city/accept';
    return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
  }

  public declineRequest(data): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    params = params.append('cityId', data.cityId);
    console.log('Params to decline city request:', params);
    let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
    const url = environment.apiUrl + '/city/decline';
    return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
  }
}
