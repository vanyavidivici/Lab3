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

  openProjects!: Observable<ProjectListItem[]>;

  constructor(private router: Router, private fundraisingService: FundraisingService) { }

  ngOnInit(): void {
    this.openProjects = this.fundraisingService.getOpenProjects().pipe(
      map(response => response)
    );
    console.log(this.openProjects);
  }

  navigateToAddProject(): void {
    this.router.navigate(['/add-project']);
  }
}