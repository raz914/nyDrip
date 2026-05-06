import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { getAdminStorageBucket, requireAdminRequest } from "@/lib/firebaseAdmin";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  return 400;
}

function getExtension(file) {
  const nameExtension = file.name?.split(".").pop()?.toLowerCase();

  if (nameExtension && /^[a-z0-9]+$/.test(nameExtension)) {
    return nameExtension;
  }

  return file.type.split("/")[1] || "jpg";
}

export async function POST(request) {
  try {
    await requireAdminRequest(request);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { ok: false, message: "Choose an image file to upload." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { ok: false, message: "Upload a JPG, PNG, WebP, or GIF image." },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, message: "Image must be smaller than 5 MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const token = randomUUID();
    const extension = getExtension(file);
    const filePath = `blog/${Date.now()}-${randomUUID()}.${extension}`;
    const bucket = getAdminStorageBucket();
    const storageFile = bucket.file(filePath);

    await storageFile.save(buffer, {
      contentType: file.type,
      metadata: {
        cacheControl: "public, max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      filePath,
    )}?alt=media&token=${token}`;

    return NextResponse.json({
      ok: true,
      url,
      path: filePath,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Could not upload image." },
      { status: errorStatus(error?.message) },
    );
  }
}
