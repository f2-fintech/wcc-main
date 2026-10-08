import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models/Event';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    await dbConnect();
    
    if (body.status === 'upcoming') {
      await Event.updateMany({ _id: { $ne: (await params).id } }, { status: 'past' });
    }
    
    const event = await Event.findByIdAndUpdate((await params).id, body, { new: true });
    if (!event) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const event = await Event.findByIdAndDelete((await params).id);
    if (!event) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
