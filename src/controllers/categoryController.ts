// src/controllers/category.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';
import { AuthRequest } from '../middlewares/authMiddleware';

export class CategoryController {
    // Обновление метода createCategory
    createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, allowedGroups } = req.body;

            if (!name) {
                res.status(400).json({ error: 'Название категории обязательно' });
                return;
            }

            const categoryService: CategoryService = req.app.locals.categoryService;

            // Проверяем, является ли пользователь администратором
            const authReq = req as AuthRequest;
            const isAdmin = authReq.user?.group === 'admin';

            // Если не администратор, проверяем права
            if (!isAdmin && allowedGroups) {
                res.status(403).json({ error: 'Только администраторы могут определять права доступа к категориям' });
                return;
            }

            // Создаем категорию
            const createdCategory = await categoryService.createCategory({
                name,
                allowedGroups: isAdmin ? allowedGroups : ['user', 'admin'] // По умолчанию доступно всем
            });

            res.status(201).json({ category: createdCategory });
        } catch (error) {
            next(error);
        }
    };

    // Обновление метода updateCategory
    updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, allowedGroups } = req.body;

            if (!name && !allowedGroups) {
                res.status(400).json({ error: 'Необходимо указать хотя бы одно поле для обновления' });
                return;
            }

            // Проверяем, является ли пользователь администратором
            const authReq = req as AuthRequest;
            const isAdmin = authReq.user?.group === 'admin';

            // Если не администратор, но пытается изменить права доступа
            if (!isAdmin && allowedGroups) {
                res.status(403).json({ error: 'Только администраторы могут изменять права доступа к категориям' });
                return;
            }

            const categoryService: CategoryService = req.app.locals.categoryService;

            // Создаем объект с обновляемыми полями
            const updateData: { name?: string; allowedGroups?: string[] } = {};

            if (name) {
                updateData.name = name;
            }

            if (isAdmin && allowedGroups) {
                updateData.allowedGroups = allowedGroups;
            }

            const updatedCategory = await categoryService.updateCategory(id, updateData);

            if (!updatedCategory) {
                res.status(404).json({ error: 'Категория не найдена или неверный формат id' });
                return;
            }

            res.status(200).json({ category: updatedCategory });
        } catch (error) {
            next(error);
        }
    };

    // Остальные методы контроллера без изменений
    getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categoryService: CategoryService = req.app.locals.categoryService;
            const categories = await categoryService.getAllCategories();
            res.status(200).json({ categories });
        } catch (error) {
            next(error);
        }
    };

    getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const categoryService: CategoryService = req.app.locals.categoryService;
            const category = await categoryService.getCategoryById(id);

            if (!category) {
                res.status(404).json({ error: 'Категория не найдена или неверный формат id' });
                return;
            }

            res.status(200).json({ category });
        } catch (error) {
            next(error);
        }
    };

    deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const categoryService: CategoryService = req.app.locals.categoryService;
            const deletedCategory = await categoryService.deleteCategory(id);

            if (!deletedCategory) {
                res.status(404).json({ error: 'Категория не найдена или неверный формат id' });
                return;
            }

            res.status(200).json({ message: 'Категория успешно удалена', category: deletedCategory });
        } catch (error) {
            next(error);
        }
    };
}

export default new CategoryController();
