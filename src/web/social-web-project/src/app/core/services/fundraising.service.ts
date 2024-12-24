import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContributeRequest } from '../models/contribute-request.model';
import { BaseResponseModel } from '../models/base-response';
import { ChangeProjectRequest } from '../models/request/change-project-request.model';
import { Project } from '../models/response/project-response.model';
import { ProjectReport } from '../models/response/projects-report-response.model';
import { CreateProjectRequest } from '../models/request/create-project-request.model';

@Injectable({
  providedIn: 'root'
})
export class FundraisingService {

  private baseUrl: string = environment.apiBaseUrl + '/fundraising';

  constructor(private httpClient: HttpClient) { }

  getOpenProjects(): Observable<ProjectReport[]> {
    return this.httpClient.get<ProjectReport[]>(`${this.baseUrl}/open-projects`);
  }

  getMyProjects(): Observable<ProjectReport[]> {
    return this.httpClient.get<ProjectReport[]>(`${this.baseUrl}/my-projects`);
  }

  createProject(model: CreateProjectRequest): Observable<number> {
    return this.httpClient.post<number>(`${this.baseUrl}/create-project`, model );
  }

  getProject(projectId: number): Observable<Project> {
    return this.httpClient.get<Project>(`${this.baseUrl}/get-project/${projectId}`);
   }

  changeProject(model: ChangeProjectRequest): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.baseUrl}/change-project`, model );
  }

  deleteProject(projectId: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.baseUrl}/delete-project/${projectId}`, { });
  }

  contribute(model: ContributeRequest): Observable<BaseResponseModel<string>> {
    return this.httpClient.post<BaseResponseModel<string>>(`${this.baseUrl}/contribute`, model);
  }

  getBalance(): Observable<number> {
    return this.httpClient.post<number>(`${this.baseUrl}/balance`, { });
  }

  refund(projectId: number): Observable<string> {
    return this.httpClient.post<string>(`${this.baseUrl}/refund`, projectId);
  }

  changeDeadline(projectId: number, newDeadline: Date, userName: string): Observable<string> {
    return this.httpClient.post<string>(`${this.baseUrl}/change-deadline`, { projectId, newDeadline, userName });
  }

  getContributors(projectId: number): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/contributors/${projectId}`);
  }

  getContribution(projectId: number, userName: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/contribution/${projectId}`, { params: { userName } });
  }

  isProjectOpen(projectId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/is-project-open/${projectId}`);
  }
}