import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { JoinRequest } from '@/models/JoinRequest';
import { Doctor } from '@/models/Doctor';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await dbConnect();
    
    const joinRequest = await JoinRequest.findByIdAndUpdate(id, body, { new: true });
    
    if (!joinRequest) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    // Auto-create doctor if approved
    if (body.status === 'approved') {
      const existingDoc = await Doctor.findOne({ email: joinRequest.email });
      if (!existingDoc) {
        await Doctor.create({
          name: joinRequest.name,
          slug: joinRequest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          specialization: joinRequest.specialty,
          city: joinRequest.city,
          state: 'Unknown',
          hospital: joinRequest.workplace,
          experienceYears: 0,
          qualifications: 'Doctor',
          bio: 'Welcome to White Coat Club.',
          email: joinRequest.email,
          phone: joinRequest.phone,
          isPublished: false,
        });
      }
    }

    return NextResponse.json({ success: true, data: joinRequest });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
