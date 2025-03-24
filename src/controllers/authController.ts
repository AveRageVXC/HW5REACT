// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/userRepository';
import { RefreshTokenRepository } from '../repositories/refreshTokenRepository';
import tokenService from '../services/tokenService';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

export class AuthController {
    private userRepository: UserRepository;
    private refreshTokenRepository: RefreshTokenRepository;

    constructor(db: any) {
        this.userRepository = new UserRepository(db);
        this.refreshTokenRepository = new RefreshTokenRepository(db);
    }

    // Регистрация нового пользователя
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, email, password } = req.body;

            // Проверка существования пользователя
            const existingUser = await this.userRepository.findUserByEmail(email);

            if (existingUser) {
                res.status(400).json({ message: 'Пользователь с таким email уже существует' });
                return;
            }

            // Создание пользователя
            const user = await this.userRepository.createUser({
                username,
                email,
                password,
                group: 'user'
            });

            // Генерация токенов
            const accessToken = tokenService.generateAccessToken({
                _id: user._id,
                username: user.username,
                email: user.email,
                group: user.group,
                avatarUrl: user.avatarUrl
            });

            const refreshToken = crypto.randomBytes(40).toString('hex');
            await this.refreshTokenRepository.createToken(user._id, refreshToken);

            // Установка куки
            this.setTokenCookies(res, accessToken, refreshToken);

            res.status(201).json({
                message: 'Пользователь успешно зарегистрирован',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    group: user.group,
                    avatarUrl: user.avatarUrl
                }
            });
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            res.status(500).json({ message: 'Ошибка сервера при регистрации' });
        }
    };
    // Остальные методы контроллера аналогично обновите...

    // Вспомогательный метод для установки куки с токенами
    private setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
        // Установка access токена в куки (15 минут)
        res.cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Установка refresh токена в куки (7 дней)
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    }

    // src/controllers/auth.controller.ts - добавляем следующие методы

// Вход пользователя
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            // Находим пользователя по email
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                res.status(401).json({ message: 'Неверный email или пароль' });
                return;
            }

            // Проверяем пароль
            const isPasswordValid = await this.userRepository.comparePasswords(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Неверный email или пароль' });
                return;
            }

            // Генерируем токены
            const accessToken = tokenService.generateAccessToken({
                _id: user._id,
                username: user.username,
                email: user.email,
                group: user.group,
                avatarUrl: user.avatarUrl
            });

            const refreshToken = crypto.randomBytes(40).toString('hex');
            await this.refreshTokenRepository.createToken(user._id, refreshToken);

            // Устанавливаем куки
            this.setTokenCookies(res, accessToken, refreshToken);

            // Также отправляем токены в ответе для клиентов, которые используют заголовок Authorization
            res.status(200).json({
                message: 'Вход выполнен успешно',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    group: user.group,
                    avatarUrl: user.avatarUrl
                },
                tokens: {
                    accessToken,
                    refreshToken
                }
            });
        } catch (error) {
            console.error('Ошибка при входе:', error);
            res.status(500).json({ message: 'Ошибка сервера при входе' });
        }
    };

// Обновление токенов
    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'Требуется аутентификация' });
                return;
            }

            // Хешируем refresh токен для поиска в базе
            const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

            // Проверяем refresh токен
            const tokenDoc = await this.refreshTokenRepository.findTokenByHash(tokenHash);
            if (!tokenDoc) {
                res.status(401).json({ message: 'Недействительный или истекший refresh токен' });
                return;
            }

            // Удаляем использованный refresh токен
            await this.refreshTokenRepository.removeToken(tokenHash);

            // Получаем данные пользователя
            const user = await this.userRepository.findUserById(tokenDoc.userId.toString());
            if (!user) {
                res.status(401).json({ message: 'Пользователь не найден' });
                return;
            }

            // Генерируем новые токены
            const accessToken = tokenService.generateAccessToken({
                _id: user._id,
                username: user.username,
                email: user.email,
                group: user.group,
                avatarUrl: user.avatarUrl
            });

            const newRefreshToken = crypto.randomBytes(40).toString('hex');
            await this.refreshTokenRepository.createToken(user._id, newRefreshToken);

            // Устанавливаем куки
            this.setTokenCookies(res, accessToken, newRefreshToken);

            res.status(200).json({
                message: 'Токены успешно обновлены',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    group: user.group,
                    avatarUrl: user.avatarUrl
                }
            });
        } catch (error) {
            console.error('Ошибка при обновлении токенов:', error);
            res.status(500).json({ message: 'Ошибка сервера при обновлении токенов' });
        }
    };

// Выход пользователя
    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (refreshToken) {
                // Хешируем refresh токен для поиска в базе
                const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

                // Удаляем refresh токен из базы данных
                await this.refreshTokenRepository.removeToken(tokenHash);
            }

            // Очищаем куки
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            res.status(200).json({ message: 'Выход выполнен успешно' });
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            res.status(500).json({ message: 'Ошибка сервера при выходе' });
        }
    };


}
