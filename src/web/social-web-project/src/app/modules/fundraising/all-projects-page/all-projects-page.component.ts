import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectListItem } from '../models/project-list-item.model';
import { FundraisingService } from '../../../core/services/fundraising.service';

@Component({
  selector: 'app-all-projects-page',
  templateUrl: './all-projects-page.component.html',
  styleUrls: ['./all-projects-page.component.scss']
})
export class AllProjectsPageComponent implements OnInit {

  openProjects!: Observable<ProjectListItem[]>;

  constructor(private fundraisingService: FundraisingService) { }

  ngOnInit(): void {
    this.openProjects = this.fundraisingService.getOpenProjects().pipe(
      map(response => {
        console.log(response);
        return response as ProjectListItem[];
      })
    );
  }
}