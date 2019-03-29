import { TaskDetails } from '../shared/interfaces/task-details.interface';

export let tasks: TaskDetails[] = [
    {
        _id: null,
        title: 'Test Task 1',
        description: 'This task has a description.',
        isComplete: false,
        goalDate: new Date('03-03-2019'),
        listID: null,
        isArchived: false
    },
    {
        _id: null,
        title: 'Test Task 2',
        description: '',
        isComplete: false,
        goalDate: null,
        listID: null,
        isArchived: false
    },
    {
        _id: null,
        title: 'Test Task 3',
        description: '',
        isComplete: true,
        goalDate: new Date('02-29-2019'),
        listID: null,
        isArchived: false
    }
];
