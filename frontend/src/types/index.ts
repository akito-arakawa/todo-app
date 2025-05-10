export interface TaskRequest {
    title: string;
    dueDate: string | null;
};

export interface Task {
    id: string;
    title: string;
    status: string;
    dueDate: string | null;
    userId: string;
    createdAt: string;
}

export type FilterTab = `all` | `active` | `completed` | `overdue` | `upcoming`;