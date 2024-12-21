import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundraisingRoutingModule } from './fundraising-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { AllProjectsPageComponent } from './all-projects-page/all-projects-page.component';
import { MyProjectsPageComponent } from './my-projects-page/my-projects-page.component';
import { ReportPageComponent } from './report-page/report-page.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';


@NgModule({
  declarations: [
  
    AddProjectComponent,
       AllProjectsPageComponent,
       MyProjectsPageComponent,
       ReportPageComponent,
       EditProjectComponent,
       ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    FundraisingRoutingModule
  ]
})
export class FundraisingModule { }
