import { Router, Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

const router = Router();

// 1. Создание категории (POST /api/categories)
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const categoryService: CategoryService = req.app.locals.categoryService;
        const createdCategory = await categoryService.createCategory({
            name });
        res.status(201).json({ category: createdCategory });
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 2. Получение списка категорий (GET /api/categories)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryService: CategoryService = req.app.locals.categoryService;
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 3. Получение деталей категории (GET /api/categories/:id)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
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
        console.error('Ошибка при получении категории:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 4. Обновление категории (PUT /api/categories/:id)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const categoryService: CategoryService = req.app.locals.categoryService;
        const updatedCategory = await categoryService.updateCategory(id, { name });
        if (!updatedCategory) {
            res.status(404).json({ error: 'Категория не найдена или неверный формат id' });
            return;
        }
        res.status(200).json({ category: updatedCategory });
    } catch (error) {
        console.error('Ошибка при обновлении категории:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 5. Удаление категории (DELETE /api/categories/:id)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
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
        console.error('Ошибка при удалении категории:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;