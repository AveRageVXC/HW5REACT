import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
    // Создание товара
    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, category, quantity, price } = req.body;

            if (!name || !description || !category || quantity == null || price == null) {
                res.status(400).json({ error: 'Все поля обязательны для заполнения' });
                return;
            }

            const productService: ProductService = req.app.locals.productService;
            const createdProduct = await productService.createProduct({
                name,
                description,
                category,
                quantity,
                price
            });

            res.status(201).json({
                message: 'Товар успешно создан',
                product: createdProduct
            });
        } catch (error) {
            console.error('Ошибка при создании товара:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Получение списка товаров
    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            // Извлекаем параметры limit и offset с умолчательными значениями, если они отсутствуют
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const offset = parseInt(req.query.offset as string, 10) || 0;

            const productService: ProductService = req.app.locals.productService;
            const products = await productService.getProducts(limit, offset);
            res.status(200).json({ products, limit, offset });
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Получение товара по ID
    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const productService: ProductService = req.app.locals.productService;
            const product = await productService.getProductById(id);

            if (!product) {
                res.status(404).json({ error: 'Товар не найден' });
                return;
            }

            res.status(200).json({ product });
        } catch (error) {
            console.error('Ошибка при получении товара:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Обновление товара
    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, description, category, quantity, price } = req.body;
            const productService: ProductService = req.app.locals.productService;

            const updatedProduct = await productService.updateProduct(id, {
                name,
                description,
                category,
                quantity,
                price,
            });

            if (!updatedProduct) {
                res.status(404).json({ error: 'Товар не найден или неверный id' });
                return;
            }

            res.status(200).json({ product: updatedProduct });
        } catch (error) {
            console.error('Ошибка при обновлении товара:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Удаление товара
    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const productService: ProductService = req.app.locals.productService;

            const deletedProduct = await productService.deleteProduct(id);

            if (!deletedProduct) {
                res.status(404).json({ error: 'Товар не найден или id имеет неверный формат' });
                return;
            }

            res.status(200).json({ message: 'Товар успешно удалён', product: deletedProduct });
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}

export default new ProductController();
