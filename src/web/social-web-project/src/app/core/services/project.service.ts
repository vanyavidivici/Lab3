import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectReport } from '../models/response/projects-report-response.model';
import { CreateProjectRequest } from '../models/request/create-project-request.model';
import { BaseResponseModel } from '../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl: string = environment.apiBaseUrl + '/projects';

  constructor(private httpClient: HttpClient) { }

  getOpenProjects(): Observable<BaseResponseModel<ProjectReport[]>> {
    return this.httpClient.get<BaseResponseModel<ProjectReport[]>>(`${this.baseUrl}/open-projects`);
  }

  createProject(model: CreateProjectRequest, userName: string): Observable<BaseResponseModel<number>> {
    const currentDate = new Date();
    const deadlineDate = new Date(model.deadline);
    const daysDifference = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return this.httpClient.post<BaseResponseModel<number>>(`${this.baseUrl}/create`, { ...model, daysDifference, userName });
  }

  getProjectsReport(): Observable<BaseResponseModel<{ successfulProjects: ProjectReport[], failedProjects: ProjectReport[] }>> {
    return this.httpClient.get<BaseResponseModel<{ successfulProjects: ProjectReport[], failedProjects: ProjectReport[] }>>(`${this.baseUrl}/projects-report`);
  }
}