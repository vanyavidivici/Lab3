import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectListItem } from '../models/project-list-item.model';
import { FundraisingService } from '../../../core/services/fundraising.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss']
})
export class ProjectListItemComponent {
  @Input() project!: ProjectListItem;

  constructor(
    private router: Router,
    private fundraisingService: FundraisingService,
    private toastr: ToastrService
  ) { }

  viewProjectDetails(): void {
    this.router.navigate(['/project-details', this.project.projectId]);
  }

  editProject(): void {
    this.router.navigate(['/edit-project', this.project.projectId]);
  }

  deleteProject(): void {
      this.fundraisingService.deleteProject(this.project.projectId).subscribe(
        () => {
          this.toastr.success('Project deleted successfully!');
          
          this.router.navigate(['']);
          console.log('Navigated to home page');
        },
        (error) => {
          this.toastr.error('Failed to delete project.');
          console.error(error);
        }
      );
    }
}