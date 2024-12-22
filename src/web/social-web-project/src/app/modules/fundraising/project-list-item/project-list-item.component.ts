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

  editProject(): void {
    this.router.navigate(['/edit-project', this.project.projectId]);
  }

  deleteProject(): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.fundraisingService.deleteProject(this.project.projectId).subscribe(
        () => {
          this.toastr.success('Project deleted successfully!');
          // Optionally, you can add logic to refresh the project list
        },
        (error) => {
          this.toastr.error('Failed to delete project.');
          console.error(error);
        }
      );
    }
  }
}