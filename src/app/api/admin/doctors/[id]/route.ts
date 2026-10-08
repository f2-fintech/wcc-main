import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Doctor } from '@/models/Doctor';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    await dbConnect();
    const doctor = await Doctor.findByIdAndUpdate((await params).id, body, { new: true });
    if (!doctor) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: doctor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const doctor = await Doctor.findByIdAndDelete((await params).id);
    if (!doctor) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
