import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  const pathParts = parsedUrl.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1]; // Get the last part (filename)
  const fileNameWithoutExt = lastPart.split(".")[0]; // Remove extension

  if (!fileNameWithoutExt) {
    throw new Error("Invalid Cloudinary URL format");
  }
  return fileNameWithoutExt;
};

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "Valid URLs array is required" },
        { status: 400 }
      );
    }

    // Convert URLs to public IDs
    const publicIds = urls.map((url) => extractPublicIdFromUrl(url));

    // Delete multiple images from Cloudinary
    const result = await cloudinary.api.delete_resources(publicIds, {
      type: "upload",
      resource_type: "image",
    });

    if (result.deleted) {
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to delete images" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    return NextResponse.json(
      { success: false, error: String(error) || "Internal server error" },
      { status: 500 }
    );
  }
}
