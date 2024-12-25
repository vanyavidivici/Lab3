import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectListItem } from '../models/project-list-item.model';

@Component({
  selector: 'app-report-project-list-item',
  templateUrl: './report-project-list-item.component.html',
  styleUrls: ['./report-project-list-item.component.scss']
})
export class ReportProjectListItemComponent {
@Input() project!: ProjectListItem;

  constructor(
    private router: Router,
  ) { }
}
