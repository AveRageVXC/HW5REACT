// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import tokenService from '../services/tokenService';
import {ICategory} from "../models/categoryModel";
import {ObjectId} from "mongodb";

// Расширяем интерфейс Request для добавления поля user
export interface AuthRequest extends Request {
    user?: any;
}

// Правильное определение middleware с корректными типами
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Пробуем получить токен из куки
        let accessToken = req.cookies?.accessToken;

        // Если токена нет в куки, пробуем взять из заголовка Authorization
        if (!accessToken) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.substring(7); // Удаляем 'Bearer ' из начала
            }
        }

        if (!accessToken) {
            res.status(401).json({ message: 'Требуется аутентификация' });
            return;
        }

        const userData = tokenService.verifyAccessToken(accessToken);
        if (!userData) {
            res.status(401).json({ message: 'Недействительный токен' });
            return;
        }

        // Добавляем информацию о пользователе к запросу
        (req as AuthRequest).user = userData;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Ошибка аутентификации' });
    }
};


// Middleware для проверки роли пользователя
export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authReq = req as AuthRequest;

            if (!authReq.user) {
                res.status(401).json({ message: 'Требуется аутентификация' });
                return;
            }

            if (!roles.includes(authReq.user.group)) {
                res.status(403).json({ message: 'Доступ запрещен' });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Ошибка проверки прав доступа' });
        }
    };
};
