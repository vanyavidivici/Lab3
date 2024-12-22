import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectListItem } from '../models/project-list-item.model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.scss']
})
export class ProjectsTabComponent implements OnInit {

  openProjects!: Observable<ProjectListItem[]>;
  activeTabIndex: number = 0;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.openProjects = this.projectService.getOpenProjects().pipe(
      map(response => response.data as ProjectListItem[])
    );
    const savedTabIndex = localStorage.getItem('activeTabIndex');
    if (savedTabIndex !== null) {
      this.activeTabIndex = +savedTabIndex;
    }
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    localStorage.setItem('activeTabIndex', this.activeTabIndex.toString());
  }
}