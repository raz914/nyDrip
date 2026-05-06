import { NextResponse } from "next/server";

import {
  BLOG_POSTS_COLLECTION,
  BLOG_STATUS,
  mapBlogPostDoc,
  sanitizeBlogPostPayload,
} from "@/lib/blogPosts";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  if (message === "Blog post not found.") {
    return 404;
  }
  return 400;
}

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

async function getPostRef(params) {
  const { id } = await params;

  if (!id) {
    throw new Error("Blog post not found.");
  }

  const ref = getAdminDb().collection(BLOG_POSTS_COLLECTION).doc(id);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error("Blog post not found.");
  }

  return { ref, snapshot };
}

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request);
    const { snapshot } = await getPostRef(params);

    return NextResponse.json({
      ok: true,
      post: mapBlogPostDoc(snapshot),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not load blog post.", errorStatus(error?.message));
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdminRequest(request);
    const { ref, snapshot } = await getPostRef(params);
    const previous = snapshot.data() || {};
    const payload = sanitizeBlogPostPayload(await request.json().catch(() => ({})));
    const now = new Date();
    const wasPublished = previous.status === BLOG_STATUS.PUBLISHED;
    const nextPublished = payload.status === BLOG_STATUS.PUBLISHED;
    const publishedAt = nextPublished
      ? previous.publishedAt || now
      : null;

    await ref.set(
      {
        ...payload,
        updatedAt: now,
        publishedAt: wasPublished || nextPublished ? publishedAt : null,
      },
      { merge: true },
    );

    return NextResponse.json({
      ok: true,
      post: mapBlogPostDoc(await ref.get()),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not update blog post.", errorStatus(error?.message));
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdminRequest(request);
    const { ref } = await getPostRef(params);

    await ref.delete();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return jsonError(error?.message || "Could not delete blog post.", errorStatus(error?.message));
  }
}
