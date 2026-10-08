import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models/Event';
import { EventRegistration } from '@/models/EventRegistration';
import { eventRegistrationSchema } from '@/validators';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = eventRegistrationSchema.parse({ ...body, eventId: (await params).id });

    await dbConnect();

    // Check if event exists and is open
    const event = await Event.findById((await params).id);
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (!event.registrationOpen || event.status !== 'upcoming') {
      return NextResponse.json({ success: false, error: 'Registration is closed for this event' }, { status: 400 });
    }

    // Check seat limit
    const currentRegistrations = await EventRegistration.countDocuments({ eventId: (await params).id });
    if (currentRegistrations >= event.seatLimit) {
      return NextResponse.json({ success: false, error: 'Event is fully booked' }, { status: 400 });
    }

    // Check if user already registered for this event
    const existingReg = await EventRegistration.findOne({ email: validatedData.email, eventId: (await params).id });
    if (existingReg) {
      return NextResponse.json({ success: false, error: 'You are already registered for this event' }, { status: 400 });
    }

    // Create registration
    const registration = await EventRegistration.create({
      eventId: event._id,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      specialization: validatedData.specialization,
      hospital: validatedData.hospital,
      city: validatedData.city,
    });

    // Optional: Send confirmation email here using mailer.ts

    return NextResponse.json({ success: true, data: registration }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
