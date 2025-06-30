import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .unsigned_upload_stream(
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset",
        {
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error("No secure_url returned from Cloudinary"));
          }
        }
      )
      .end(fileBuffer);
  });
};

// POST /api/cloudinary/upload
export async function POST(req: NextRequest) {
  try {
    const { buffer } = await req.json();
    if (!buffer) {
      return NextResponse.json(
        { error: "No file buffer provided" },
        { status: 400 }
      );
    }
    const fileBuffer = Buffer.from(buffer);
    const url = await uploadToCloudinary(fileBuffer);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
