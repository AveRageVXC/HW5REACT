import { Db, ObjectId } from 'mongodb';
import { ICategory } from '../models/categoryModel';

export class CategoryRepository {
    constructor(private db: Db) {}

    // Создание новой категории
    async createCategory(categoryData: Pick<ICategory, 'name' | 'allowedGroups'>): Promise<ICategory & { _id: ObjectId }> {
        const result = await this.db.collection<ICategory>('categories')
            .insertOne({
                name: categoryData.name,
                allowedGroups: categoryData.allowedGroups || ['user', 'admin'] // По умолчанию доступно всем
            });
        return {
            _id: result.insertedId,
            name: categoryData.name,
            allowedGroups: categoryData.allowedGroups || ['user', 'admin']
        };
    }

    // Получение списка всех категорий
    async getAllCategories(): Promise<Array<ICategory & { _id: ObjectId }>> {
        return this.db.collection<ICategory>('categories').find().toArray();
    }

    // Получение категории по её ID
    async getCategoryById(id: string): Promise<(ICategory & { _id: ObjectId }) | null> {
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return null;
        }
        return this.db.collection<ICategory>('categories').findOne({ _id: objectId });
    }

    // Обновление категории по ID (обновляется только имя)
    async updateCategory(id: string, updateData: Partial<ICategory>): Promise<(ICategory & { _id: ObjectId }) | null> {
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return null;
        }

        // Создаем объект с обновляемыми полями
        const updateFields: Partial<ICategory> = {};

        if (updateData.name !== undefined) {
            updateFields.name = updateData.name;
        }

        if (updateData.allowedGroups !== undefined) {
            updateFields.allowedGroups = updateData.allowedGroups;
        }

        const result = await this.db.collection<ICategory>('categories')
            .findOneAndUpdate(
                { _id: objectId },
                { $set: { name: updateData.name } },
                { returnDocument: 'after' }
            );
        return result;
    }

    // Удаление категории по ID
    async deleteCategory(id: string): Promise<(ICategory & { _id: ObjectId }) | null> {
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return null;
        }
        const result = await this.db.collection<ICategory>('categories')
            .findOneAndDelete({ _id: objectId });
        return result;
    }

    // Можно добавить и другие методы (например, получение, обновление, удаление)
}