import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Doctor } from '@/models/Doctor';

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '9') || 9));
    const search = (searchParams.get('search') || '').slice(0, 100).trim();
    const specialization = (searchParams.get('specialization') || '').slice(0, 100).trim();
    const city = (searchParams.get('city') || '').slice(0, 100).trim();

    const query: any = { isPublished: true };

    if (search) {
      query.name = { $regex: escapeRegex(search), $options: 'i' };
    }
    if (specialization) {
      query.specialization = { $regex: escapeRegex(specialization), $options: 'i' };
    }
    if (city) {
      query.city = { $regex: escapeRegex(city), $options: 'i' };
    }

    const doctors = await Doctor.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit)),
        limit,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
