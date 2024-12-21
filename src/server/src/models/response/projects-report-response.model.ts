export interface ProjectReport {
    name: string;
    description: string;
    goalAmount: number;
    receivedAmount: number;
    deadline: number;
}

export interface ProjectReportResult {
    successfulProjects: ProjectReport[];
    failedProjects: ProjectReport[];
}