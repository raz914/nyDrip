import { NextResponse } from "next/server";

import {
  BLOG_POSTS_COLLECTION,
  BLOG_STATUS,
  importStaticBlogPosts,
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
  return 400;
}

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function GET(request) {
  try {
    await requireAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    let query = getAdminDb()
      .collection(BLOG_POSTS_COLLECTION)
      .orderBy("updatedAt", "desc")
      .limit(100);

    if (status === BLOG_STATUS.DRAFT || status === BLOG_STATUS.PUBLISHED) {
      query = getAdminDb()
        .collection(BLOG_POSTS_COLLECTION)
        .where("status", "==", status)
        .orderBy("updatedAt", "desc")
        .limit(100);
    }

    const snapshot = await query.get();

    return NextResponse.json({
      ok: true,
      posts: snapshot.docs.map(mapBlogPostDoc),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not load blog posts.", errorStatus(error?.message));
  }
}

export async function POST(request) {
  try {
    await requireAdminRequest(request);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "import-static") {
      const summary = await importStaticBlogPosts(getAdminDb());
      return NextResponse.json({
        ok: true,
        summary,
      });
    }

    const payload = sanitizeBlogPostPayload(await request.json().catch(() => ({})));
    const now = new Date();
    const docPayload = {
      ...payload,
      createdAt: now,
      updatedAt: now,
      publishedAt: payload.status === BLOG_STATUS.PUBLISHED ? now : null,
    };
    const ref = await getAdminDb().collection(BLOG_POSTS_COLLECTION).add(docPayload);
    const snapshot = await ref.get();

    return NextResponse.json({
      ok: true,
      post: mapBlogPostDoc(snapshot),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not create blog post.", errorStatus(error?.message));
  }
}
