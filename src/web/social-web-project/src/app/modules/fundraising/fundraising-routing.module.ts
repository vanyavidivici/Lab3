import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './add-project/add-project.component';
import { AllProjectsPageComponent } from './all-projects-page/all-projects-page.component';

const routes: Routes = [
  { path: 'add-project', component: AddProjectComponent },
  { path: 'my-projects', component: AllProjectsPageComponent },
  { path: '', redirectTo: '/my-projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/my-projects' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundraisingRoutingModule { }
