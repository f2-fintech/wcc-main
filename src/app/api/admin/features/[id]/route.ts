import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Feature } from '@/models/Feature';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    await dbConnect();
    const feature = await Feature.findByIdAndUpdate(id, body, { new: true });
    if (!feature) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: feature });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const feature = await Feature.findByIdAndDelete(id);
    if (!feature) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
