import { errorHandler } from './middlewares/errorHandler';
import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes';
import categoriesRoutes from './routes/categoryRoutes';
import {connectDB} from "./db";
import {ProductRepository} from "./repositories/productRepository";
import {ProductService} from "./services/productService";
import { CategoryRepository } from './repositories/categoryRepository';
import { CategoryService } from './services/categoryService';

const app = express();

// Middleware
// app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

const startServer = async () => {
    // Подключаемся к MongoDB
    const db = await connectDB();

    const productRepository = new ProductRepository(db);
    const productService = new ProductService(productRepository);
    const categoryRepo = new CategoryRepository(db);
    const categoryService = new CategoryService(categoryRepo);
    app.use((req, res, next) => {
        // Добавляем в locals экземпляр сервиса, чтобы получить к нему доступ в роутере
        req.app.locals.productService = productService;
        next();
    });
    app.locals.categoryService = categoryService;
    // Регистрируем роуты
    app.use('/api/products', productRoutes);
    // Роутинг для категорий
    app.use('/api/categories', categoriesRoutes);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
};

startServer();