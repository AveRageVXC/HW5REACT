import { ProductRepository } from '../repositories/productRepository';
import {ObjectId, WithId} from "mongodb";
import {IProduct} from "../models/productModel";

export class ProductService {
    private productRepo: ProductRepository;

    constructor(productRepo: ProductRepository) {
        this.productRepo = productRepo;
    }

    // Метод для создания нового продукта
    async createProduct(productData: {
        name: string;
        description: string;
        category: string;
        quantity: number;
        price: number;
    }): Promise<IProduct> {

        // Применяем бизнес-правила при необходимости (например, проверка корректности данных)
        // Создаём объект продукта с полем createdAt
        const product: IProduct = {
            ...productData,
            createdAt: new Date()
        };

        // Сохраняем через репозиторий
        const result = await this.productRepo.create(product);

        console.log('Создан продукт с id:', result.insertedId);

        // Если нужно вернуть сохранённый объект, можно добавить _id
        return { ...product, _id: result.insertedId } as IProduct;
    }

    // Пример получения всех продуктов
    async getProducts(limit: number, offset: number): Promise<IProduct[]> {
        return this.productRepo.getAll(limit, offset);
    }

    async getProductById(id: string): Promise<(IProduct & WithId<IProduct>) | null> {
        return this.productRepo.getById(id);
    }

    async updateProduct(id: string, updateData: {
        name: string;
        description: string;
        category: string;
        quantity: number;
        price: number;
    }): Promise<(IProduct & WithId<IProduct>) | null> {
        return this.productRepo.updateById(id, updateData);
    }


    async deleteProduct(id: string): Promise<(IProduct & WithId<IProduct>) | null> {
        return this.productRepo.deleteById(id);
    }
}