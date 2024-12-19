import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContributeRequest } from '../models/request/contribute-request.model';
import { BaseResponseModel } from '../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  private baseUrl: string = environment.apiBaseUrl + '/contribution';

  constructor(private httpClient: HttpClient) { }

  contribute(model: ContributeRequest, userName: string): Observable<BaseResponseModel<number>> {
    return this.httpClient.post<BaseResponseModel<number>>(`${this.baseUrl}/contribute`, { ...model, userName });
  }

  getBalance(userName: string): Observable<BaseResponseModel<number>> {
    return this.httpClient.get<BaseResponseModel<number>>(`${this.baseUrl}/balance/${userName}`);
  }
}