import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Doctor } from '@/models/Doctor';

export async function GET() {
  try {
    await dbConnect();
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: doctors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Doctor name is required" }, { status: 400 });
    }

    await dbConnect();

    // Auto-generate slug if missing or blank
    let slug = (body.slug || "")
      .trim()
      .toLowerCase()
      .replace(/^dr\.?\s*/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      slug = body.name
        .trim()
        .toLowerCase()
        .replace(/^dr\.?\s*/i, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `doctor-${Date.now()}`;
    }

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await Doctor.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter++}`;
    }
    body.slug = uniqueSlug;

    const doctor = await Doctor.create(body);
    return NextResponse.json({ success: true, data: doctor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
