import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * @param buffer  - Raw file bytes
 * @param folder  - Cloudinary folder to organise uploads (e.g. 'portfolio/cv')
 * @param options - Extra Cloudinary upload options
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  options: Record<string, unknown> = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'auto', // handles images, PDFs, etc.
          ...options,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export default cloudinary;
