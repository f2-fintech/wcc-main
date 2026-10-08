import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { JoinRequest } from '@/models/JoinRequest';

export async function GET() {
  try {
    await dbConnect();
    const requests = await JoinRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
