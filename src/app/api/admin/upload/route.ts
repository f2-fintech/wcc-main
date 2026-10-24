import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import { getAdminSession } from '@/lib/auth';
import smartcrop from 'smartcrop-sharp';
import sharp from 'sharp';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds maximum allowed limit of 5MB' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' }, { status: 400 });
    }

    const sanitizedBase = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const extMatch = sanitizedBase.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ success: false, error: 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp are allowed.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `uploads/${uniqueSuffix}-${sanitizedBase}`;

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
