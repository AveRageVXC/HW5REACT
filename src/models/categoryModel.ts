import { ObjectId } from 'mongodb';

export interface ICategory {
    _id?: ObjectId; // Опционально, т.к. при создании ещё нет id
    name: string;
    allowedGroups: string[];
}