import {Db, InsertOneResult, ObjectId, WithId} from 'mongodb';
import {IProduct} from "../models/productModel";

export class ProductRepository {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    // Метод для создания продукта в коллекции
    async create(product: IProduct): Promise<InsertOneResult<IProduct>> {
        console.log(`Добавляю продукт в бд`);
        return this.db.collection('products').insertOne(product);
    }

    // Метод для получения всех продуктов
    async getAll(limit: number, offset: number): Promise<(IProduct)[]> {
        // Здесь явно указываем тип IProduct для коллекции:
        return this.db.collection<IProduct>('products')
            .find()
            .skip(offset)
            .limit(limit)
            .toArray();
    }

    async getById(id: string): Promise<(IProduct & WithId<IProduct>) | null> {
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            // Если id имеет неверный формат – возвращаем null или можно обработать ошибку
            return null;
        }
        return await this.db.collection<IProduct>('products').findOne({ _id: objectId });
    }

    async updateById(id: string, updateData: {
        name: string;
        description: string;
        category: string;
        quantity: number;
        price: number;
    }): Promise<(IProduct & WithId<IProduct>) | null> {
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return null;
        }

        return await this.db.collection<IProduct>('products').findOneAndUpdate(
            { _id: objectId },
            { $set: updateData },
            { returnDocument: 'after' }
        );
    }

    async deleteById(id: string): Promise<(IProduct & WithId<IProduct>) | null> {
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return null;
        }

        return await this.db.collection<IProduct>('products').findOneAndDelete({ _id: objectId });
    }

    // Можно добавить дополнительные методы (обновление, удаление) по необходимости
}