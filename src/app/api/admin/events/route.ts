import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models/Event';
import { JoinRequest } from '@/models/JoinRequest';
import { sendEmail } from '@/lib/mailer';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    // If setting as upcoming, might want to set all others to past, depending on business logic.
    if (body.status === 'upcoming') {
      await Event.updateMany({}, { status: 'past' });
    }
    
    const event = await Event.create(body);
    
    // Send email to all registered members/join requests
    if (body.status === 'upcoming') {
      try {
        const requests = await JoinRequest.find().select('email name'); 
        for (const req of requests) {
          await sendEmail({
            to: req.email,
            subject: `New Event Announced: ${event.editionName}`,
            html: `
              <h2>White Coat Club - New Event!</h2>
              <p>Dear Dr. ${req.name},</p>
              <p>We are excited to announce our upcoming event: <strong>${event.editionName}</strong></p>
              <p><strong>Date:</strong> ${event.date}</p>
              <p><strong>Time:</strong> ${event.time}</p>
              <p><strong>Venue:</strong> ${event.venue}, ${event.location}</p>
              <br/>
              <p>Visit our website to reserve your seat before they run out!</p>
              <p>Best regards,<br/>The White Coat Club Team</p>
            `
          });
        }
      } catch (emailError) {
        console.error("Failed to send event emails:", emailError);
        // Don't fail the event creation if emails fail
      }
    }

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
