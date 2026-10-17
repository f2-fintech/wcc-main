import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  slug: string;
  photoUrl?: string;
  specialization?: string;
  qualifications?: string;
  hospital?: string;
  city?: string;
  state?: string;
  experienceYears?: number;
  bio?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
  };
  focalPoint?: {
    x: number;
    y: number;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    photoUrl: { type: String, default: "" },
    specialization: { type: String, default: "" },
    qualifications: { type: String, default: "" },
    hospital: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    socialLinks: {
      linkedin: { type: String, default: "" },
    },
    focalPoint: {
      x: { type: Number, default: 50 },
      y: { type: Number, default: 15 },
    },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
