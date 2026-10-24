import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ContactMessage } from '@/models/ContactMessage';
import { contactFormSchema } from '@/validators';
import { sendEmail } from '@/lib/mailer';
import { escapeHtml } from '@/lib/utils';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`contact_${ip}`, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    await dbConnect();

    const contactMessage = await ContactMessage.create(validatedData);

    const safeName = escapeHtml(validatedData.name);
    const safeSubject = escapeHtml(validatedData.subject);
    const safeMessage = escapeHtml(validatedData.message);

    // Send confirmation email to the user (informing their query is received)
    try {
      await sendEmail({
        to: validatedData.email,
        subject: `We've received your message - White Coat Club`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <div style="border-bottom: 2px solid #C5A880; padding-bottom: 16px; margin-bottom: 20px;">
              <h2 style="color: #0A192F; margin: 0; font-size: 22px; font-weight: 700;">The White Coat Club</h2>
            </div>
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 16px;">Dear <strong>${safeName}</strong>,</p>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
              Thank you for reaching out to us. We have received your query regarding <strong>"${safeSubject}"</strong>.
            </p>
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #0A192F;">Query Summary:</p>
              <p style="margin: 4px 0; font-size: 14px; color: #4b5563;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #4b5563;"><strong>Message:</strong></p>
              <p style="margin: 6px 0 0 0; font-size: 14px; color: #374151; white-space: pre-wrap; background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb;">${safeMessage}</p>
            </div>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
              Our team will review your message and get back to you shortly.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              Warm regards,<br />
              <strong style="color: #0A192F;">White Coat Club Team</strong><br />
              Noida Sector 63, India &bull; <a href="mailto:marketing@f2fintech.com" style="color: #C5A880; text-decoration: none;">marketing@f2fintech.com</a>
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error('Failed to send user confirmation email:', mailError);
    }

    return NextResponse.json({ success: true, data: contactMessage }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
