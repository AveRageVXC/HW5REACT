// src/routes/productRoutes.ts
import { Router } from 'express';
import productController from '../controllers/productController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';

const router = Router();

// Создание товара (только для админов)
router.post('/',
    authMiddleware,
    checkRole(['admin']),
    productController.createProduct.bind(productController)
);

// Получение списка товаров (доступно авторизованным пользователям)
router.get('/',
    authMiddleware,
    productController.getProducts.bind(productController)
);

// Получение товара по ID (доступно авторизованным пользователям)
router.get('/:id',
    authMiddleware,
    productController.getProductById.bind(productController)
);

// Обновление товара (только для админов)
router.put('/:id',
    authMiddleware,
    checkRole(['admin']),
    productController.updateProduct.bind(productController)
);

// Удаление товара (только для админов)
router.delete('/:id',
    authMiddleware,
    checkRole(['admin']),
    productController.deleteProduct.bind(productController)
);

export default router;
