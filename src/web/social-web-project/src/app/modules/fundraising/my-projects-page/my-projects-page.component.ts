import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProjectListItem } from '../models/project-list-item.model';
import { FundraisingService } from '../../../core/services/fundraising.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrls: ['./my-projects-page.component.scss']
})
export class MyProjectsPageComponent implements OnInit {

  myProjects!: Observable<ProjectListItem[]>;

  constructor(private router: Router, private fundraisingService: FundraisingService) { }

  ngOnInit(): void {
    this.myProjects = this.fundraisingService.getMyProjects().pipe(
      map(response => response as ProjectListItem[])
    );
    console.log(this.myProjects);
  }

  navigateToAddProject(): void {
    this.router.navigate(['/add-project']);
  }
}