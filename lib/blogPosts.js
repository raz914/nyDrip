import { blogPosts as staticBlogPosts } from "@/components/blog/data";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const BLOG_POSTS_COLLECTION = "blogPosts";
export const BLOG_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

const DEFAULT_IMAGE = "/blog/iv-therapy-consultation-thumbnail.png";
const DEFAULT_IMAGE_ALT = "NY Drip Lounge wellness article";

function toDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDisplayDate(value) {
  const date = toDate(value);

  if (!date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function serializeTimestamp(value) {
  const date = toDate(value);
  return date ? date.toISOString() : null;
}

function normalizeBody(body) {
  if (!Array.isArray(body)) {
    return [];
  }

  return body
    .map((section) => ({
      heading: String(section?.heading ?? "").trim(),
      body: String(section?.body ?? "").trim(),
    }))
    .filter((section) => section.body)
    .map((section) =>
      section.heading
        ? section
        : {
            body: section.body,
          },
    );
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBlogTopics(posts) {
  return ["All", ...new Set(posts.map((post) => post.topic).filter(Boolean))];
}

export function getBlogYears(posts) {
  return ["All", ...new Set(posts.map((post) => post.year).filter(Boolean))];
}

export function mapBlogPostDoc(doc) {
  const data = doc.data ? doc.data() : doc;
  const publishDate = toDate(data.publishDate) ?? toDate(data.publishedAt) ?? toDate(data.createdAt);
  const title = String(data.title ?? "").trim();
  const slug = slugify(data.slug || title || doc.id);

  return {
    id: doc.id ?? data.id ?? slug,
    slug,
    title,
    date: data.date || formatDisplayDate(publishDate),
    topic: String(data.topic ?? "Wellness").trim() || "Wellness",
    year: String(data.year ?? publishDate?.getFullYear?.() ?? new Date().getFullYear()),
    image: String(data.image ?? "").trim() || DEFAULT_IMAGE,
    imageAlt: String(data.imageAlt ?? "").trim() || DEFAULT_IMAGE_ALT,
    imageClassName: String(data.imageClassName ?? "").trim() || "object-cover",
    heroImage: String(data.heroImage ?? "").trim() || "",
    heroImageAlt: String(data.heroImageAlt ?? "").trim() || "",
    heroImageClassName: String(data.heroImageClassName ?? "").trim() || "",
    excerpt: String(data.excerpt ?? "").trim(),
    body: normalizeBody(data.body),
    status: data.status === BLOG_STATUS.PUBLISHED ? BLOG_STATUS.PUBLISHED : BLOG_STATUS.DRAFT,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
    publishedAt: serializeTimestamp(data.publishedAt),
  };
}

export function sanitizeBlogPostPayload(payload = {}) {
  const title = String(payload.title ?? "").trim();
  const slug = slugify(payload.slug || title);
  const topic = String(payload.topic ?? "Wellness").trim() || "Wellness";
  const body = normalizeBody(payload.body);
  const publishDate = payload.publishDate ? new Date(payload.publishDate) : new Date();
  const year = String(payload.year || publishDate.getFullYear());
  const status =
    payload.status === BLOG_STATUS.PUBLISHED ? BLOG_STATUS.PUBLISHED : BLOG_STATUS.DRAFT;

  if (!title) {
    throw new Error("Blog title is required.");
  }

  if (!slug) {
    throw new Error("Blog slug is required.");
  }

  if (!body.length) {
    throw new Error("Add at least one blog body section.");
  }

  if (Number.isNaN(publishDate.getTime())) {
    throw new Error("Choose a valid publish date.");
  }

  return {
    slug,
    title,
    topic,
    year,
    date: formatDisplayDate(publishDate),
    publishDate,
    image: String(payload.image ?? "").trim() || DEFAULT_IMAGE,
    imageAlt: String(payload.imageAlt ?? "").trim() || DEFAULT_IMAGE_ALT,
    imageClassName: String(payload.imageClassName ?? "").trim() || "object-cover",
    heroImage: String(payload.heroImage ?? "").trim(),
    heroImageAlt: String(payload.heroImageAlt ?? "").trim(),
    heroImageClassName: String(payload.heroImageClassName ?? "").trim(),
    excerpt: String(payload.excerpt ?? "").trim(),
    body,
    status,
  };
}

function parseStaticPublishDate(post) {
  const parsed = new Date(post.date);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date();
}

export function mapStaticBlogPostToDoc(post) {
  const publishDate = parseStaticPublishDate(post);

  return {
    slug: slugify(post.slug || post.title),
    title: String(post.title ?? "").trim(),
    date: String(post.date ?? formatDisplayDate(publishDate)),
    topic: String(post.topic ?? "Wellness").trim() || "Wellness",
    year: String(post.year ?? publishDate.getFullYear()),
    image: String(post.image ?? "").trim() || DEFAULT_IMAGE,
    imageAlt: String(post.imageAlt ?? "").trim() || DEFAULT_IMAGE_ALT,
    imageClassName: String(post.imageClassName ?? "").trim() || "object-cover",
    heroImage: String(post.heroImage ?? "").trim(),
    heroImageAlt: String(post.heroImageAlt ?? "").trim(),
    heroImageClassName: String(post.heroImageClassName ?? "").trim(),
    excerpt: String(post.excerpt ?? "").trim(),
    body: normalizeBody(post.body),
    status: BLOG_STATUS.PUBLISHED,
    publishDate,
    publishedAt: publishDate,
  };
}

export async function importStaticBlogPosts(db = getAdminDb()) {
  const result = {
    imported: 0,
    updated: 0,
    skipped: 0,
    total: staticBlogPosts.length,
  };

  for (const staticPost of staticBlogPosts) {
    const docPayload = mapStaticBlogPostToDoc(staticPost);

    if (!docPayload.slug) {
      result.skipped += 1;
      continue;
    }

    const existingBySlug = await db
      .collection(BLOG_POSTS_COLLECTION)
      .where("slug", "==", docPayload.slug)
      .limit(1)
      .get();
    const now = new Date();

    if (!existingBySlug.empty) {
      const existingDoc = existingBySlug.docs[0];
      await existingDoc.ref.set(
        {
          ...docPayload,
          updatedAt: now,
          createdAt: existingDoc.data().createdAt ?? now,
        },
        { merge: true },
      );
      result.updated += 1;
      continue;
    }

    await db.collection(BLOG_POSTS_COLLECTION).add({
      ...docPayload,
      createdAt: now,
      updatedAt: now,
    });
    result.imported += 1;
  }

  return result;
}

async function hasAnyDynamicBlogPosts() {
  const snapshot = await getAdminDb()
    .collection(BLOG_POSTS_COLLECTION)
    .limit(1)
    .get();

  return !snapshot.empty;
}

export async function getPublishedBlogPosts() {
  try {
    const snapshot = await getAdminDb()
      .collection(BLOG_POSTS_COLLECTION)
      .where("status", "==", BLOG_STATUS.PUBLISHED)
      .orderBy("publishDate", "desc")
      .get();
    const posts = snapshot.docs.map(mapBlogPostDoc);

    if (posts.length) {
      return posts;
    }

    if (await hasAnyDynamicBlogPosts()) {
      return [];
    }

    return staticBlogPosts;
  } catch {
    return staticBlogPosts;
  }
}

export async function getPublishedBlogPostBySlug(slug) {
  const posts = await getPublishedBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getRelatedBlogPosts(slug, limit = 3) {
  const posts = await getPublishedBlogPosts();
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}
