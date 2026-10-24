import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Feature } from '@/models/Feature';

export async function GET() {
  try {
    await dbConnect();
    const features = await Feature.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: features });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    if (!body.description?.trim()) {
      return NextResponse.json({ success: false, error: 'Description is required' }, { status: 400 });
    }
    await dbConnect();
    const feature = await Feature.create(body);
    return NextResponse.json({ success: true, data: feature }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
