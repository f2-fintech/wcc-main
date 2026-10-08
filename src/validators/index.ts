import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  subject: z.enum(['General', 'Partner', 'Speaker', 'Bring to my city']),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
});

export const joinFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  registrationNumber: z.string().min(2, { message: 'Medical registration number is required' }),
  specialization: z.string().min(2, { message: 'Specialization is required' }),
  hospital: z.string().min(2, { message: 'Hospital/Clinic name is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  experienceYears: z.coerce.number().min(0, { message: 'Experience years must be a positive number' }),
  message: z.string().optional(),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, { message: 'Event ID is required' }),
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  specialization: z.string().min(2, { message: 'Specialization is required' }),
  hospital: z.string().min(2, { message: 'Hospital/Clinic name is required' }),
  city: z.string().min(2, { message: 'City is required' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password is required' }),
});
