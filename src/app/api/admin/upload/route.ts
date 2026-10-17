import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import smartcrop from 'smartcrop-sharp';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `uploads/${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    const url = await uploadToS3(buffer, fileName, file.type);

    let focalPoint = { x: 50, y: 15 };
    try {
      const crop = await smartcrop.crop(buffer, { width: 340, height: 320 });
      const meta = await sharp(buffer).metadata();
      const rawY = (((crop.topCrop.y + crop.topCrop.height / 2) / (meta.height || 1)) * 100);
      // In portrait photos, faces are never below 32%. Clamping prevents dresses/patterns from pulling focus to the waist/chest.
      const clampedY = Math.min(Math.max(rawY, 0), 32);
      focalPoint = {
        x: Number((((crop.topCrop.x + crop.topCrop.width / 2) / (meta.width || 1)) * 100).toFixed(1)),
        y: Number(clampedY.toFixed(1)),
      };
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, url, focalPoint });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
