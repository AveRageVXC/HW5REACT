// src/models/user.model.ts
// src/models/userModel.ts
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface IUser {
    username: string;
    email: string;
    password: string;
    group: string;
    avatarUrl?: string;
}

export interface IUserWithId extends IUser {
    _id: ObjectId;
}
