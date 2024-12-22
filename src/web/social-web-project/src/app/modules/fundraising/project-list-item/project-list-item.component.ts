import { Component, Input } from '@angular/core';
import { ProjectListItem } from '../models/project-list-item.model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss']
})
export class ProjectListItemComponent {
  @Input() project!: ProjectListItem;

  constructor() { }
}