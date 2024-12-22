import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FundraisingService } from '../../../core/services/fundraising.service';
import { Project } from '../../../core/models/response/project-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project!: Project;

  constructor(
    private route: ActivatedRoute,
    private fundraisingService: FundraisingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['id'];
    this.loadProject(projectId);
  }

  loadProject(projectId: number): void {
    this.fundraisingService.getProject(projectId).subscribe(
      (project) => {
        this.project = project;
      },
      (error) => {
        this.toastr.error('Failed to load project details.');
        console.error(error);
      }
    );
  }
}