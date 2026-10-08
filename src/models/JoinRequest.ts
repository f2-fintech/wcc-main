import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJoinRequest extends Document {
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  specialization: string;
  hospital: string;
  city: string;
  experienceYears: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const JoinRequestSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    specialization: { type: String, required: true },
    hospital: { type: String, required: true },
    city: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const JoinRequest: Model<IJoinRequest> =
  mongoose.models.JoinRequest || mongoose.model<IJoinRequest>('JoinRequest', JoinRequestSchema);
