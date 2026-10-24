import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeature extends Document {
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Feature: Model<IFeature> =
  mongoose.models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);
