export interface ProjectReport {
    projectId: number;
    name: string;
    description: string;
    goalAmount: number;
    receivedAmount: number;
    deadline: number;
    isOpen: boolean;
  }

export interface ProjectReportResult {
    successfulProjects: ProjectReport[];
    failedProjects: ProjectReport[];
}