import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { forEach } from '@angular/router/src/utils/collection';
import { Slot } from '../models/slot';
import { Ground } from '../models/ground';
import { Reservation } from '../models/reservation';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class SlotsService {

    constructor(private http: HttpClient) { }

    public getSlots(data): Observable<HttpResponse<any>> {
        console.log('in load grounds service call');
        let params = new HttpParams();
        params = params.append('parkId', data.parkId);
        params = params.append('cityId', data.cityId);
        params = params.append('groundId', data.groundId);
        params = params.append('endDate', data.endDate);
        params = params.append('startDate', data.startDate);
        if (data.sportId !== '' && data.sportId !== undefined) {
            params = params.append('sportId', data.sportId);
        }
        console.log('Params to get slots in service call:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/slots/slotsbyparkandground';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public getReservationDetails(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('cityId', data.cityId);
        console.log('Params to reactivate slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/reservations/reserveddetailsbyslot';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public getReservationRequests(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('repId', data.repId);
        params = params.append('cityId', data.cityId);
        console.log('Params to reactivate slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/reservations/requestsbyslot';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public assignSlotFifo(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('repId', data.repId);
        params = params.append('cityId', data.cityId);
        console.log('Params to assign slot FIFO:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/reservations/fifo';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    // slot assign random
    public assignSlotRandom(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('repId', data.repId);
        params = params.append('cityId', data.cityId);
        console.log('Params to assign slot random:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/reservations/random';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    // slot assign
    public assignCustomSlot(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('repId', data.repId);
        params = params.append('cityId', data.cityId);
        params = params.append('reservationId', data.reservationId);
        console.log('Params to assign slot random:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/reservations/custom';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public getGrounds(data): Observable<HttpResponse<any>> {
        console.log('thses are the data  from get Grounds by park', data);
        let params = new HttpParams();
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        params = params.append('cityId', data.cityId);
        params = params.append('parkId', data.parkId);
        const options = { observe: 'response', params: params, headers: headers };
        const url = environment.apiUrl + '/grounds/park';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public deleteSlotSchedule(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('scheduleId', data.scheduleId);
        params = params.append('cityId', data.cityId);
        params = params.append('repId', data.repId);
        console.log('Params to delete slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/schedules';
        return this.http.delete<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public deleteSlot(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('cityId', data.cityId);
        params = params.append('repId', data.repId);
        console.log('Params to delete slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/slots';
        return this.http.delete<any>(url, { observe: 'response', params: params, headers: headers });
    }
    public cancelSlot(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('cityId', data.cityId);
        params = params.append('repId', data.repId);
        params = params.append('cancellationReason', data.cancellationReason);
        console.log('Params to cancel slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/slots/cancel';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public reactivateSlot(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('repId', data.repId);
        params = params.append('cityId', data.cityId);
        console.log('Params to reactivate slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/slots/activate';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
    public resetReservations(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('repId', data.repId);
        params = params.append('cityId', data.cityId);
        console.log('Params to reactivate slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/reservations/reset';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }

    public getSlot(data): any {

    }

    public editSchedule(data): any {

    }

    public getSports(data): Observable<HttpResponse<any>> {
        console.log('this is the data from get Sports by ground', data);
        let params = new HttpParams();
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        params = params.append('groundId', data.groundId);
        params = params.append('cityId', data.cityId);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/groundssports/ground';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }

    public getScheduleDetails(data): Observable<HttpResponse<any>> {
        console.log('this is the data from get Sports by ground', data);
        let params = new HttpParams();
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        params = params.append('scheduleId', data.scheduleId);
        params = params.append('cityId', data.cityId);
        const options = { params: params, headers: headers };
        const url = environment.apiUrl + '/schedules/byid';
        return this.http.get<any>(url, { observe: 'response', params: params, headers: headers });
    }

    // update slot collection
    public editSlot(data): Observable<HttpResponse<any>> {
        let params = new HttpParams();
        params = params.append('slotId', data.slotId);
        params = params.append('repId', data.repId);
        params = params.append('cityId', data.cityId);
        params = params.append('newSportId', data.newSportId);
        params = params.append('oldSportId', data.oldSportId);
        params = params.append('groundId', data.groundId);
        params = params.append('newTime', data.newTime);
        params = params.append('oldTime', data.oldTime);
        params = params.append('newDate', data.newDate);
        params = params.append('oldDate', data.oldDate);
        params = params.append('slotCategory', data.slotCategory);
        params = params.append('openDate', data.openDate);
        params = params.append('closeDate', data.closeDate);
        params = params.append('autoFIFO', data.autoFIFO);
        console.log('Params to edit slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/slots';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }

    // update schedule
    public scheduleUpdate(data): Observable<HttpResponse<any>> {
        // console.log('schedule update',data)
        let params = new HttpParams();
        params = params.append('scheduleId', data.scheduleId);
        params = params.append('sportId', data.sportId);
        params = params.append('groundId', data.groundId);
        params = params.append('repId', data.repId);
        params = params.append('slot', data.slot);
        params = params.append('startDate', data.startDate);
        params = params.append('endDate', data.endDate);
        params = params.append('days', data.days);
        params = params.append('parkId', data.parkId);
        params = params.append('cityId', data.cityId);
        params = params.append('scheduleCategory', data.scheduleCategory);
        params = params.append('startBefore', data.openBefore);
        params = params.append('endBefore', data.closeBefore);
        params = params.append('autoFIFO', data.autoFIFO);
        console.log('Params to edit slot:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/schedules';
        return this.http.put<any>(url, '', { observe: 'response', params: params, headers: headers });
    }

    // slot creation
    public addSlot(data): Observable<HttpResponse<any>> {
        console.log('new slot create', data);
        let params = new HttpParams();
        params = params.append('repId', data.repId);
        params = params.append('sportId', data.sportId);
        params = params.append('groundId', data.groundId);
        params = params.append('parkId', data.parkId);
        params = params.append('date', data.date);
        params = params.append('slot', data.slot);
        params = params.append('cityId', data.cityId);
        params = params.append('slotCategory', data.slotCategory);
        params = params.append('openDate', data.openDate);
        params = params.append('closeDate', data.closeDate);
        params = params.append('autoFIFO', data.autoFIFO);
        console.log('Params to add park:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/slots';
        return this.http.post<any>(url, '', { observe: 'response', params: params, headers: headers });
    }

    // schedule creation
    addSchedule(data): Observable<HttpResponse<any>> {
        console.log('new schedule create', data);
        let params = new HttpParams();
        params = params.append('repId', data.repId);
        params = params.append('sportId', data.sportId);
        params = params.append('groundId', data.groundId.Ground_Id);
        params = params.append('parkId', data.parkId);
        params = params.append('startDate', data.startDate);
        params = params.append('endDate', data.endDate);
        params = params.append('slot', data.slot);
        params = params.append('cityId', data.cityId);
        params = params.append('days', data.days);
        params = params.append('scheduleCategory', data.scheduleCategory);
        params = params.append('startBefore', data.startBefore);
        params = params.append('endBefore', data.endBefore);
        params = params.append('autoFIFO', data.autoFIFO);
        console.log('Params to add schedule:', params);
        let headers = new HttpHeaders().set('authorizationtoken', data.authorizationToken);
        const url = environment.apiUrl + '/schedules';
        return this.http.post<any>(url, '', { observe: 'response', params: params, headers: headers });
    }
}
