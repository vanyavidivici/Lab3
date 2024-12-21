import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectReport } from '../models/response/projects-report-response.model';
import { CreateProjectRequest } from '../models/request/create-project-request.model';
import { BaseResponseModel } from '../models/base-response';
import { ChangeProjectRequest } from '../models/request/change-project-request.model';
import { Project } from '../models/response/project-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl: string = environment.apiBaseUrl + '/projects';

  constructor(private httpClient: HttpClient) { }

  getOpenProjects(): Observable<BaseResponseModel<ProjectReport[]>> {
    return this.httpClient.get<BaseResponseModel<ProjectReport[]>>(`${this.baseUrl}/open-projects`);
  }

  createProject(model: CreateProjectRequest): Observable<BaseResponseModel<number>> {
    return this.httpClient.post<BaseResponseModel<number>>(`${this.baseUrl}/create-project`, { model });
  }

  getProject(projectId: number): Observable<BaseResponseModel<Project>> {
    return this.httpClient.get<BaseResponseModel<Project>>(`${this.baseUrl}/project/${projectId}`);
   }

  changeProject(model: ChangeProjectRequest): Observable<BaseResponseModel<boolean>> {
    return this.httpClient.post<BaseResponseModel<boolean>>(`${this.baseUrl}/change-project`, { model });
  }

  deleteProject(projectId: number): Observable<BaseResponseModel<boolean>> {
    return this.httpClient.post<BaseResponseModel<boolean>>(`${this.baseUrl}/delete-project/${projectId}`, { });
  }

  getProjectsReport(): Observable<BaseResponseModel<{ successfulProjects: ProjectReport[], failedProjects: ProjectReport[] }>> {
    return this.httpClient.get<BaseResponseModel<{ successfulProjects: ProjectReport[], failedProjects: ProjectReport[] }>>(`${this.baseUrl}/projects-report`);
  }
}