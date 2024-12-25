import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FundraisingService } from '../../../core/services/fundraising.service';
import { Project } from '../../../core/models/response/project-response.model';
import { ToastrService } from 'ngx-toastr';
import { ContributeRequest } from 'src/app/core/models/request/contribute-request.model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project!: Project;
  contributors: string[] = [];
  balance: number = 0;
  contributionAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fundraisingService: FundraisingService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['id'];
    this.loadProject(projectId);
  }

  loadProject(projectId: number): void {
    this.fundraisingService.getProject(projectId).subscribe(
      (project) => {
        console.log(project);
        this.project = project;
      },
      (error) => {
        this.toastr.error('Failed to load project details.');
        console.error(error);
      }
    );

    this.fundraisingService.getContributors(projectId).subscribe(
      (contributors) => {
        this.contributors = contributors;
      },
      (error) => {
        this.toastr.error('Failed to load contributors.');
        console.error(error);
      }
    );

    this.fundraisingService.getBalance().subscribe(
      (balance) => {
        this.balance = balance;
        localStorage.setItem('balance', balance.toString());
      },
      (error) => {
        this.toastr.error('Failed to load balance.');
        console.error(error);
      }
    );
  }

  contribute(): void {
    if (this.contributionAmount > 0 && this.contributionAmount <= this.balance) {
      var contributeRequest: ContributeRequest = {
        projectId: this.project.projectId,
        amount: this.contributionAmount
      };
      this.fundraisingService.contribute(contributeRequest).subscribe(
        (response) => {
          localStorage.setItem('balance', response.toString());
          this.toastr.success('Contribution successful!');
          this.router.navigate(['/my-projects']);
        },
        (error) => {
          this.toastr.error('Failed to contribute to the project.');
          console.error(error);
        }
      );
    }
  }

  refund(): void {
    if (confirm('Are you sure you want to request a refund?')) {
      this.fundraisingService.refund(this.project.projectId).subscribe(
        (response) => {
          this.toastr.success('Refund successful!');
          this.router.navigate(['/my-projects']);
        },
        (error) => {
          this.toastr.error('Failed to process refund.');
          console.error(error);
        }
      );
    }
  }
}