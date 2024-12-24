import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FundraisingService } from 'src/app/core/services/fundraising.service';
import { ProjectListItem } from '../models/project-list-item.model';
import { ReportService } from 'src/app/core/services/report.service';
import { ProjectReport, ProjectReportResult } from 'src/app/core/models/response/projects-report-response.model';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent {
    successfulProjects: ProjectReport[] = [];
    unsuccessfulProjects: ProjectReport[] = [];
  
    constructor(private reportService: ReportService) { }
  
    ngOnInit(): void {
      this.reportService.getProjectsReport().subscribe(
        (response: ProjectReportResult) => {
          this.successfulProjects = response.successfulProjects;
          this.unsuccessfulProjects = response.failedProjects;
        },
        (error) => {
          console.error('Error fetching projects report:', error);
        }
      );
    }
}
