import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectReport, ProjectReportResult } from '../models/response/projects-report-response.model';
import { CreateProjectRequest } from '../models/request/create-project-request.model';
import { ChangeProjectRequest } from '../models/request/change-project-request.model';
import { Project } from '../models/response/project-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private prefix: string = '/fundraising';
  private baseUrl: string = environment.apiBaseUrl + this.prefix;

  constructor(private httpClient: HttpClient) { }

  getProjectsReport(): Observable<ProjectReportResult> {
    return this.httpClient.get<ProjectReportResult>(`${this.baseUrl}/projects-report`);
  }
}