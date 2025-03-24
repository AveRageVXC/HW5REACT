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
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import {AuthController} from "./controllers/authController";

const app = express();

// Middleware
// app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));

const PORT = 3000;

const startServer = async () => {
    // Подключаемся к MongoDB
    const db = await connectDB();

    const productRepository = new ProductRepository(db);
    const productService = new ProductService(productRepository);
    const categoryRepo = new CategoryRepository(db);
    const categoryService = new CategoryService(categoryRepo);
    const authController = new AuthController(db);

    // Добавление сервисов в app.locals для доступа из middleware и контроллеров
    app.locals.categoryService = categoryService;
    app.locals.productService = productService;
    app.locals.db = db;

    app.use((req, res, next) => {
        // Добавляем в locals экземпляр сервиса, чтобы получить к нему доступ в роутере
        req.app.locals.productService = productService;
        next();
    });
    app.locals.categoryService = categoryService;
    // Регистрируем роуты
    app.use('/api/auth', (req, res, next) => {
        req.app.locals.authController = authController;
        next();
    }, authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/categories', categoriesRoutes);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
};

startServer();