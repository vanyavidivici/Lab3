import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FundraisingService } from '../../../core/services/fundraising.service';
import { ChangeProjectRequest } from '../../../core/models/request/change-project-request.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  projectForm: FormGroup;
  projectId: number = 0;

  constructor(
    private fb: FormBuilder,
    private fundraisingService: FundraisingService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      deadline: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(1)]],
      isOpen: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params['id'];
    console.log('Project ID:', this.projectId);
    this.loadProject();
  }

  loadProject(): void {
    // Load the project details and populate the form
    this.fundraisingService.getProject(this.projectId).subscribe(
      (project) => {
        console.log('Project details:', project);
        const deadlineDate = new Date(project.deadline * 1000); // Assuming deadline is in seconds
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          deadline: deadlineDate,
          targetAmount: project.goalAmount,
          isOpen: project.isOpen
        });
        console.log('Form values after patch:', this.projectForm.value);
      },
      (error) => {
        this.toastr.error('Failed to load project details.');
        console.error('Error loading project details:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const project: ChangeProjectRequest = {
        projectId: this.projectId,
        ...this.projectForm.value,
        deadline: Math.floor(new Date(this.projectForm.value.deadline).getTime() / 1000) // Convert to seconds
      };
      console.log('Submitting project:', project);
      this.fundraisingService.changeProject(project).subscribe(
        (response) => {
          console.log('Project update response:', response);
          this.toastr.success('Project updated successfully!');
          this.router.navigate(['/my-projects']);
        },
        (error) => {
          this.toastr.error('Failed to update project.');
          console.error('Error updating project:', error);
        }
      );
    } else {
      console.log('Form is invalid:', this.projectForm.errors);
    }
  }
}