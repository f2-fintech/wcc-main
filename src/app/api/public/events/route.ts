import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models/Event';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status) {
      query.status = status; // 'upcoming' | 'past'
    }

    const events = await Event.find(query).sort({ date: -1 });

    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
