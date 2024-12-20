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

  contribute(model: ContributeRequest, userName: string): Observable<BaseResponseModel<string>> {
    return this.httpClient.post<BaseResponseModel<string>>(`${this.baseUrl}/contribute`, { ...model, userName });
  }

  getBalance(userName: string): Observable<BaseResponseModel<number>> {
    return this.httpClient.post<BaseResponseModel<number>>(`${this.baseUrl}/balance`, { userName });
  }

  refund(projectId: number, userName: string): Observable<BaseResponseModel<string>> {
    return this.httpClient.post<BaseResponseModel<string>>(`${this.baseUrl}/refund`, { projectId, userName });
  }

  changeDeadline(projectId: number, newDeadline: Date, userName: string): Observable<BaseResponseModel<string>> {
    return this.httpClient.post<BaseResponseModel<string>>(`${this.baseUrl}/change-deadline`, { projectId, newDeadline, userName });
  }

  getContributors(projectId: number): Observable<BaseResponseModel<string[]>> {
    return this.httpClient.get<BaseResponseModel<string[]>>(`${this.baseUrl}/contributors/${projectId}`);
  }

  getContribution(projectId: number, userName: string): Observable<BaseResponseModel<number>> {
    return this.httpClient.get<BaseResponseModel<number>>(`${this.baseUrl}/contribution/${projectId}`, { params: { userName } });
  }

  isProjectOpen(projectId: number): Observable<BaseResponseModel<boolean>> {
    return this.httpClient.get<BaseResponseModel<boolean>>(`${this.baseUrl}/is-project-open/${projectId}`);
  }
}