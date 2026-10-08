import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Doctor } from '@/models/Doctor';

export async function GET() {
  try {
    await dbConnect();
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: doctors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const doctor = await Doctor.create(body);
    return NextResponse.json({ success: true, data: doctor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
