import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectListItem } from '../models/project-list-item.model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-all-projects-page',
  templateUrl: './all-projects-page.component.html',
  styleUrls: ['./all-projects-page.component.scss']
})
export class AllProjectsPageComponent implements OnInit {

  openProjects!: Observable<ProjectListItem[]>;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.openProjects = this.projectService.getOpenProjects().pipe(
      map(response => response as ProjectListItem[])
    );
  }
}