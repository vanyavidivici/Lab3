import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectListItem } from '../models/project-list-item.model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss']
})
export class ProjectListItemComponent {
  @Input() project!: ProjectListItem;

  constructor(
    private router: Router,
  ) { }

  viewProjectDetails(): void {
    this.router.navigate(['/project-details', this.project.projectId]);
  }
}