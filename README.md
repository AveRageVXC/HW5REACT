# Как тестировать API
## 1. Установка и запуск
### Установка зависимостей
npm install

### Запуск сервера
nodemon

## 2. Регистрация и авторизация
### Регистрация нового пользователя

POST http://localhost:3000/api/auth/register

```
{
"username": "user",
"email": "user@example.com",
"password": "password123"
}
```

### Регистрация администратора

```
POST http://localhost:3000/api/auth/register

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123"
}
```

Важно: После регистрации нужно в MongoDB изменить группу пользователя на "admin"

### Вход в систему
```
POST http://localhost:3000/api/auth/login

{
"email": "admin@example.com",
"password": "admin123"
}
```

## 3. Работа с категориями
### Создание категории (только admin)
```
POST http://localhost:3000/api/categories

{
"name": "Электроника",
"allowedGroups": ["user", "admin"]
}
```

### Получение всех категорий
```
GET http://localhost:3000/api/categories
Удаление категории (только admin)
```

### Удаление категорий
```
DELETE http://localhost:3000/api/categories/[id]
```

## 4. Работа с товарам
### Создание товара (только admin)
```
POST http://localhost:3000/api/products
{
"name": "Смартфон",
"description": "Современный смартфон",
"category": "[id_категории]",
"quantity": 10,
"price": 999.99
}
```

### Получение всех товаров

```
GET http://localhost:3000/api/products
```
Удаление товара (только admin)
```
DELETE http://localhost:3000/api/products/[id]
```
## 5. Тестирование прав доступа
Войти как обычный пользователь
Попробовать выполнить операции, доступные только администраторам (создание/удаление товаров и категорий)
Должны получить ошибку 403 Forbidden
## 6. Обновление токенов
```
POST http://localhost:3000/api/auth/refresh
```
## 7. Выход из системы
```
POST http://localhost:3000/api/auth/logout
```