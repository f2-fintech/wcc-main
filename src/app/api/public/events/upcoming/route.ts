import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models/Event';

export async function GET() {
  try {
    await dbConnect();
    
    // Find the first upcoming event (you could sort by date to get the nearest)
    const upcomingEvent = await Event.findOne({ status: 'upcoming' }).sort({ date: 1 });

    return NextResponse.json({
      success: true,
      data: upcomingEvent,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
