// Интерфейс продукта
export interface IProduct {
    // Если требуется сохранить ObjectId из Mongo, можно добавить поле _id?: any;
    // Например: _id?: string;
    name: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
    createdAt: Date;
}