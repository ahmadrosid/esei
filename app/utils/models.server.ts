export type Task = {
    id: string
    name: string
    status: string
    projectId: string
    createdAt: string
}

export type Project = {
    id: string
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    tasks: Task[]
}

export type User = {
    email: string;
    username: string;
    token: string;
    user_id: string;
};
