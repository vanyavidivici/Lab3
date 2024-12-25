import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundraisingRoutingModule } from './fundraising-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { AllProjectsPageComponent } from './all-projects-page/all-projects-page.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { MyProjectsPageComponent } from './my-projects-page/my-projects-page.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ReportPageComponent } from './report-page/report-page.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProjectsTabComponent } from './projects-tab/projects-tab.component';
import { ProjectListItemComponent } from './project-list-item/project-list-item.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AddProjectComponent,
    AllProjectsPageComponent,
    EditProjectComponent,
    MyProjectsPageComponent,
    ProjectDetailsComponent,
    ReportPageComponent,
    ProjectsTabComponent,
    ProjectListItemComponent
  ],
  imports: [
    CommonModule,
    FundraisingRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    FormsModule
  ]
})
export class FundraisingModule { }
