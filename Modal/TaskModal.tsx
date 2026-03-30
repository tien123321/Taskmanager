
export interface TaskModal{
    ProjectId: string;
    taskId: string;
    taskName: string;
    assignee: string;
    createdAt: string;
    dueDate: string;
    priority: string;
    description: string;
    isCompleted: boolean;
    isCheck: boolean;
}