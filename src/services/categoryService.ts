import { CategoryRepository } from '../repositories/categoryRepository';
import { ICategory } from '../models/categoryModel';
import { ObjectId } from 'mongodb';

export class CategoryService {
    constructor(private categoryRepo: CategoryRepository) {}

    async createCategory(categoryData: Pick<ICategory, 'name'>): Promise<ICategory & { _id: ObjectId }> {
        return this.categoryRepo.createCategory(categoryData);
    }

    async getAllCategories(): Promise<Array<ICategory & { _id: ObjectId }>> {
        return this.categoryRepo.getAllCategories();
    }

    async getCategoryById(id: string): Promise<(ICategory & { _id: ObjectId }) | null> {
        return this.categoryRepo.getCategoryById(id);
    }

    async updateCategory(id: string, updateData: Pick<ICategory, 'name'>): Promise<(ICategory & { _id: ObjectId }) | null> {
        return this.categoryRepo.updateCategory(id, updateData);
    }

    async deleteCategory(id: string): Promise<(ICategory & { _id: ObjectId }) | null> {
        return this.categoryRepo.deleteCategory(id);
    }
}