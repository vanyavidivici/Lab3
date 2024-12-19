import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';
import { BaseResponseModel } from '../models/base-response';
import { AuthModel, AuthResponseModel } from '../models/request/auth.model';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl: string = environment.apiBaseUrl + '/auth';

  constructor(private httpClient: HttpClient) { }

  login(model: AuthModel): Observable<BaseResponseModel<AuthResponseModel>> {
    return this.httpClient.post<BaseResponseModel<AuthResponseModel>>(`${this.baseUrl}/login`, model);
  }

  register(model: AuthModel): Observable<BaseResponseModel<AuthResponseModel>> {
    return this.httpClient.post<BaseResponseModel<AuthResponseModel>>(`${this.baseUrl}/register`, model);
  }

  logout() {
    return this.httpClient.get(`${this.baseUrl}/logout`);
  }
}
