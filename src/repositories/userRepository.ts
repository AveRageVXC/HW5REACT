// src/repositories/userRepository.ts
import { Db, ObjectId } from 'mongodb';
import { IUser, IUserWithId } from '../models/userModel';
import bcrypt from 'bcryptjs';

export class UserRepository {
    constructor(private db: Db) {}

    // Создание нового пользователя
    async createUser(userData: IUser): Promise<IUserWithId> {
        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = {
            ...userData,
            password: hashedPassword
        };

        const result = await this.db.collection<IUser>('users').insertOne(newUser);

        return {
            _id: result.insertedId,
            ...newUser
        };
    }

    // Найти пользователя по email
    async findUserByEmail(email: string): Promise<IUserWithId | null> {
        return this.db.collection<IUser>('users').findOne({ email });
    }

    // Найти пользователя по ID
    async findUserById(id: string): Promise<IUserWithId | null> {
        try {
            const objectId = new ObjectId(id);
            return this.db.collection<IUser>('users').findOne({ _id: objectId });
        } catch {
            return null;
        }
    }

    // Сравнить пароли
    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    // Обновить пользователя
    async updateUser(id: string, updateData: Partial<IUser>): Promise<IUserWithId | null> {
        try {
            const objectId = new ObjectId(id);
            const result = await this.db.collection<IUser>('users').findOneAndUpdate(
                { _id: objectId },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            return result;
        } catch {
            return null;
        }
    }
}
