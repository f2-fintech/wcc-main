import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarketingTeamMember extends Document {
  name: string;
  role: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MarketingTeamMemberSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    photoUrl: { type: String },
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const MarketingTeamMember: Model<IMarketingTeamMember> =
  mongoose.models.MarketingTeamMember ||
  mongoose.model<IMarketingTeamMember>('MarketingTeamMember', MarketingTeamMemberSchema);
