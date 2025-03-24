// src/models/refresh-token.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    expires: Date;
}

const refreshTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true }
});

// Создание индекса для быстрого поиска по токену
refreshTokenSchema.index({ token: 1 });

export default mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
