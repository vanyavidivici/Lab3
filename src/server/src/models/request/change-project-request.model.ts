export interface ChangeProjectRequest { 
    projectId: number;
    name: string;
    description: string;
    deadline: Date;
    targetAmount: number;
    isOpen: boolean;
}