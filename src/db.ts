import { MongoClient, Db } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'averagess';

let db: Db;

export const connectDB = async (): Promise<Db> => {
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        db = client.db(DATABASE_NAME);
        console.log(`Соединение с MongoDB установлено. База данных: ${DATABASE_NAME}`);
        return db;
    } catch (error) {
        console.error('Ошибка при подключении к MongoDB:', error);
        process.exit(1);
    }
};

export const getDB = (): Db => {
    if (!db) {
        throw new Error('База данных не инициализирована. Обязательно вызовите connectDB() при старте приложения.');
    }
    return db;
};