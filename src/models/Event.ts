import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  editionName: string;
  slug: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  description: string;
  whatToExpect: string[];
  status: 'upcoming' | 'past';
  registrationOpen: boolean;
  seatLimit: number;
  bannerImageUrl?: string;
  galleryImages: string[];
  highlightsVideoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    editionName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    whatToExpect: [{ type: String }],
    status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
    registrationOpen: { type: Boolean, default: true },
    seatLimit: { type: Number, required: true },
    bannerImageUrl: { type: String },
    galleryImages: [{ type: String }],
    highlightsVideoUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
