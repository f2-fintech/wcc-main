import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Doctor } from '@/models/Doctor';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const specialization = searchParams.get('specialization') || '';
    const city = searchParams.get('city') || '';

    const query: any = { isPublished: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
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
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
