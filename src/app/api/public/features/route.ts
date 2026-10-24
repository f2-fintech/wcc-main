import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Feature } from '@/models/Feature';

export async function GET() {
  try {
    await dbConnect();
    const features = await Feature.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: features });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
