import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { MarketingTeamMember } from '@/models/MarketingTeamMember';

export async function GET() {
  try {
    await dbConnect();
    const team = await MarketingTeamMember.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: team });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const member = await MarketingTeamMember.create(body);
    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
