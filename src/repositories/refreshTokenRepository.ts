// src/repositories/refreshTokenRepository.ts
import { Db, ObjectId } from 'mongodb';
import crypto from 'crypto';

export interface IRefreshToken {
    userId: ObjectId;
    token: string;
    expires: Date;
}

export interface IRefreshTokenWithId extends IRefreshToken {
    _id: ObjectId;
}

export class RefreshTokenRepository {
    constructor(private db: Db) {}

    // Создание refresh токена
    async createToken(userId: ObjectId, token: string, expiresInDays: number = 7): Promise<IRefreshTokenWithId> {
        const expires = new Date();
        expires.setDate(expires.getDate() + expiresInDays);

        // Хешируем токен для безопасного хранения
        const hash = crypto.createHash('sha256').update(token).digest('hex');

        const tokenDocument = {
            userId,
            token: hash,
            expires
        };

        const result = await this.db.collection<IRefreshToken>('refreshTokens').insertOne(tokenDocument);

        return {
            _id: result.insertedId,
            ...tokenDocument
        };
    }

    // Найти токен по его хешу
    async findTokenByHash(tokenHash: string): Promise<IRefreshTokenWithId | null> {
        return this.db.collection<IRefreshToken>('refreshTokens')
            .findOne({
                token: tokenHash,
                expires: { $gt: new Date() } // Проверка, что токен не истек
            });
    }

    // Удалить токен
    async removeToken(tokenHash: string): Promise<boolean> {
        const result = await this.db.collection<IRefreshToken>('refreshTokens')
            .deleteOne({ token: tokenHash });

        return result.deletedCount > 0;
    }

    // Удалить все токены пользователя
    async removeAllUserTokens(userId: ObjectId): Promise<boolean> {
        const result = await this.db.collection<IRefreshToken>('refreshTokens')
            .deleteMany({ userId });

        return result.deletedCount > 0;
    }
}
