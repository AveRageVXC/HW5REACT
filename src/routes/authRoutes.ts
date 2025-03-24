// src/routes/auth.routes.ts
import { Router } from 'express';

const router = Router();

// Регистрация
router.post('/register', (req, res, next) => {
    const authController = req.app.locals.authController;
    authController.register(req, res, next);
});

// Вход
router.post('/login', (req, res, next) => {
    const authController = req.app.locals.authController;
    authController.login(req, res, next);
});

// Обновление токенов
router.post('/refresh', (req, res, next) => {
    const authController = req.app.locals.authController;
    authController.refreshToken(req, res, next);
});

// Выход
router.post('/logout', (req, res, next) => {
    const authController = req.app.locals.authController;
    authController.logout(req, res, next);
});

export default router;
