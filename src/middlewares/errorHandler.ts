import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error('Ошибка сервера:', err); // Логирование ошибки для отладки
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}