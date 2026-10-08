import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Doctor } from '@/models/Doctor';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const doctor = await Doctor.findOne({ slug: (await params).slug, isPublished: true });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doctor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
