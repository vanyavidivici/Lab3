import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectListItem } from '../models/project-list-item.model';
import { FundraisingService } from '../../../core/services/fundraising.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.scss']
})
export class ProjectsTabComponent implements OnInit {

  openProjects!: Observable<ProjectListItem[]>;
  myProjects!: Observable<ProjectListItem[]>;
  activeTabIndex: number = 0;

  constructor(private fundraisingService: FundraisingService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.openProjects = this.fundraisingService.getOpenProjects().pipe(
      map(response => response as ProjectListItem[])
    );
    this.myProjects = this.fundraisingService.getMyProjects().pipe(
      map(response => response as ProjectListItem[])
    );
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'my-projects') {
        this.activeTabIndex = 0;
      } else if (tab === 'all-projects') {
        this.activeTabIndex = 1;
      } else if (tab === 'report') {
        this.activeTabIndex = 2;
      } else {
        const savedTabIndex = localStorage.getItem('activeTabIndex');
        if (savedTabIndex !== null) {
          this.activeTabIndex = +savedTabIndex;
        }
      }
    });
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    localStorage.setItem('activeTabIndex', this.activeTabIndex.toString());
  }
}