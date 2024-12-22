export interface ProjectListItem {
    projectId: number;
    name: string;
    description: string;
    goalAmount: number;
    receivedAmount: number;
    deadline: number;
    isOpen: boolean;
}