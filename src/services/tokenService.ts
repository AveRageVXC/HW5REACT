// src/services/token.service.ts
import jwt from 'jsonwebtoken';
import { IUserWithId } from '../models/userModel';

// Секреты для JWT - переместите в .env в реальном проекте
const ACCESS_TOKEN_SECRET = 'your_access_token_secret_key';

export class TokenService {
    // Генерация access токена (срок жизни 15 минут)
    generateAccessToken(user: any): string {
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            group: user.group,
            avatarUrl: user.avatarUrl
        };

        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            algorithm: 'HS256', // SHA-256
            expiresIn: '15m'
        });
    }

    // Верификация access токена
    verifyAccessToken(token: string): any {
        try {
            return jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (error) {
            return null;
        }
    }
}

export default new TokenService();
