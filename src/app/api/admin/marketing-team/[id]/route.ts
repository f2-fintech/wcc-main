import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { MarketingTeamMember } from '@/models/MarketingTeamMember';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    await dbConnect();
    const member = await MarketingTeamMember.findByIdAndUpdate(params.id, body, { new: true });
    if (!member) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const member = await MarketingTeamMember.findByIdAndDelete(params.id);
    if (!member) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
