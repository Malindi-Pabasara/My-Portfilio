import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

/**
 * POST /api/upload
 * Accepts multipart/form-data with:
 *   - file  : the file to upload
 *   - folder: (optional) Cloudinary folder, defaults to 'portfolio'
 *
 * Admin-only. Returns { url: string }.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied. Admins only.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) ?? 'portfolio';

    if (!file) {
      return NextResponse.json({ message: 'No file provided.' }, { status: 400 });
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: 'File exceeds the 10 MB limit.' }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = await uploadToCloudinary(buffer, folder);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
