import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  slug: string;
  photoUrl?: string;
  specialization: string;
  qualifications: string;
  hospital: string;
  city: string;
  state: string;
  experienceYears: number;
  bio: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    photoUrl: { type: String },
    specialization: { type: String, required: true },
    qualifications: { type: String, required: true },
    hospital: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    bio: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    socialLinks: {
      linkedin: { type: String },
    },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
