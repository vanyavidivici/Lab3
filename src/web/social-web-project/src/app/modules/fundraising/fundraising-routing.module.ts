import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectsTabComponent } from './projects-tab/projects-tab.component';

const routes: Routes = [
  { path: 'add-project', component: AddProjectComponent },
  { path: 'edit-project', component: AddProjectComponent },
  { path: '', component: ProjectsTabComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundraisingRoutingModule { }
