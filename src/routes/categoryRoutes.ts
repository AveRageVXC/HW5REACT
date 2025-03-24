import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';
import {checkCategoryAccess} from "../middlewares/categoryAccessMiddleware";

const router = Router();

// Получение всех категорий (доступно всем авторизованным)
router.get('/', authMiddleware, categoryController.getAllCategories);

// Получение категории по ID (проверка доступа к конкретной категории)
router.get('/:id',
    authMiddleware,
    (req, res, next) => {
        const categoryService = req.app.locals.categoryService;
        checkCategoryAccess(categoryService)(req, res, next);
    },
    categoryController.getCategoryById
);

// Создание категории (только для админов)
router.post('/',
    authMiddleware,
    checkRole(['admin']),
    categoryController.createCategory
);

// Обновление категории (только для админов)
router.put('/:id',
    authMiddleware,
    checkRole(['admin']),
    categoryController.updateCategory
);

// Удаление категории (только для админов)
router.delete('/:id',
    authMiddleware,
    checkRole(['admin']),
    categoryController.deleteCategory
);

export default router;