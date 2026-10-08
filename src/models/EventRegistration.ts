import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hospital: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    hospital: { type: String, required: true },
    city: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const EventRegistration: Model<IEventRegistration> =
  mongoose.models.EventRegistration ||
  mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);
