export interface TaskDetails {
    _id: string,
    title: string;
    description: string;
    listID: string;
    isComplete: boolean;
    goalDate: Date;
    isArchived: boolean;
}
