import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { CreateProjectRequest } from '../../../core/models/request/create-project-request.model';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router
  ) {this.projectForm = new FormGroup({});}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      deadline: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const project: CreateProjectRequest = this.projectForm.value;
      this.projectService.createProject(project).subscribe(
        (response) => {
          this.toastr.success('Project created successfully!');
          this.projectForm.reset();
        },
        (error) => {
          this.toastr.error('Failed to create project.');
          console.error(error);
        }
      );
      this.router.navigate(['']);
    }
  }
}
