import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ContactMessage } from '@/models/ContactMessage';
import { contactFormSchema } from '@/validators';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    await dbConnect();

    const contactMessage = await ContactMessage.create(validatedData);

    // Send email notification to admin (optional)
    await sendEmail({
      to: process.env.EMAIL_SERVER_USER || 'admin@whitecoatclub.com', // Admin email
      subject: `New Contact Request: ${validatedData.subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });

    return NextResponse.json({ success: true, data: contactMessage }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
