import { getProjectsReport } from "../../contracts/fundraising/fundraising";
import { ProjectReportResult } from "../../models/response/projects-report-response.model";

export async function getProjectsReportHandler(): Promise<ProjectReportResult> {
    try {
        const projectsReport = await getProjectsReport();
        return projectsReport;
    }
    catch (error) {
        console.error(error);
        return { successfulProjects: [], failedProjects: [] };
    }
}