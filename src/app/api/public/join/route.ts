import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { JoinRequest } from '@/models/JoinRequest';
import { joinFormSchema } from '@/validators';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = joinFormSchema.parse(body);

    await dbConnect();

    // Check if user already requested
    const existingRequest = await JoinRequest.findOne({ email: validatedData.email });
    if (existingRequest) {
      return NextResponse.json({ success: false, error: 'You have already submitted a request to join.' }, { status: 400 });
    }

    // Create join request
    const joinRequest = await JoinRequest.create(validatedData);

    // Send confirmation email to the user
    await sendEmail({
      to: validatedData.email,
      subject: 'Welcome to White Coat Club',
      html: `
        <h2>Welcome to White Coat Club!</h2>
        <p>Dear Dr. ${validatedData.name},</p>
        <p>Thank you for your interest in joining the White Coat Club. We have received your details and our team will review your application shortly.</p>
        <p>It's free. It's for doctors. And it's built around you.</p>
        <br/>
        <p>Best regards,</p>
        <p>The White Coat Club Team</p>
      `,
    });

    return NextResponse.json({ success: true, data: joinRequest }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
