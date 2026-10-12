import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ContactMessage } from '@/models/ContactMessage';

export async function GET() {
  try {
    await dbConnect();
    const enquiries = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
