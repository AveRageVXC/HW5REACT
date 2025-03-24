// src/middleware/category-access.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const checkCategoryAccess = (categoryService: CategoryService) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;

            // Если нет пользователя, отказываем в доступе
            if (!authReq.user) {
                res.status(401).json({ message: 'Требуется аутентификация' });
                return;
            }

            // Если пользователь администратор, разрешаем доступ
            if (authReq.user.group === 'admin') {
                next();
                return;
            }

            // Получаем ID категории из параметров или тела запроса
            const categoryId = req.params.id || req.body.category;

            // Если нет ID категории, проверяем дальше другие middleware
            if (!categoryId) {
                next();
                return;
            }

            // Получаем категорию
            const category = await categoryService.getCategoryById(categoryId);

            // Если категория не найдена
            if (!category) {
                res.status(404).json({ message: 'Категория не найдена' });
                return;
            }

            // Проверяем, есть ли группа пользователя в allowedGroups
            if (
                category.allowedGroups &&
                category.allowedGroups.includes(authReq.user.group)
            ) {
                next();
                return;
            }

            // Если нет доступа
            res.status(403).json({
                message: 'У вас нет доступа к данной категории',
                requiredGroups: category.allowedGroups
            });
        } catch (error) {
            console.error('Ошибка при проверке доступа к категории:', error);
            res.status(500).json({ message: 'Ошибка при проверке доступа к категории' });
        }
    };
};
