"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

const emptyPost = {
  id: "",
  slug: "",
  title: "",
  topic: "Wellness",
  year: String(new Date().getFullYear()),
  excerpt: "",
  image: "/blog/iv-therapy-consultation-thumbnail.png",
  imageAlt: "NY Drip Lounge wellness article",
  imageClassName: "object-cover",
  heroImage: "",
  heroImageAlt: "",
  heroImageClassName: "object-cover",
  status: "draft",
  body: [{ heading: "", body: "" }],
};

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function getPostInputDate(post) {
  const value = post?.publishedAt || post?.updatedAt || post?.createdAt;

  if (!value) {
    return getTodayInputValue();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return getTodayInputValue();
  }

  return date.toISOString().slice(0, 10);
}

function getDraftFromPost(post = emptyPost) {
  return {
    ...emptyPost,
    ...post,
    publishDate: getPostInputDate(post),
    body: post.body?.length ? post.body : [{ heading: "", body: "" }],
  };
}

function inputClassName(extra = "") {
  return [
    "w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]",
    extra,
  ].join(" ");
}

function ImageThumb({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(src);

  if (!hasSrc || failed) {
    return (
      <div className="flex h-14 w-14 items-center justify-center border border-dashed border-black/20 bg-[#f7f7f7] text-[10px] text-[#858585]">
        No preview
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || "Blog image"}
      width={56}
      height={56}
      sizes="56px"
      onError={() => setFailed(true)}
      className="h-14 w-14 border border-black/15 object-cover"
    />
  );
}

function ImagePreviewRow({ label, src, alt }) {
  return (
    <div className="mt-1 flex items-start gap-3">
      <ImageThumb src={src} alt={alt} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#858585]">{label} path</p>
        <p className="truncate text-xs text-[#111111]">{src || "—"}</p>
      </div>
    </div>
  );
}

export default function BlogAdminSection() {
  const { user, ready } = useAdminGate("/admin/blog");
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState(() => getDraftFromPost());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/blog", { headers });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not load blog posts.");
      }

      setPosts(data.posts || []);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!ready || !user) {
      return;
    }

    loadPosts();
  }, [loadPosts, ready, user]);

  function updateDraft(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateBodySection(index, field, value) {
    setDraft((current) => ({
      ...current,
      body: current.body.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    }));
  }

  function addBodySection() {
    setDraft((current) => ({
      ...current,
      body: [...current.body, { heading: "", body: "" }],
    }));
  }

  function removeBodySection(index) {
    setDraft((current) => ({
      ...current,
      body:
        current.body.length > 1
          ? current.body.filter((_, sectionIndex) => sectionIndex !== index)
          : current.body,
    }));
  }

  function startNewPost() {
    setDraft(getDraftFromPost());
    setStatus("");
    setError("");
  }

  function editPost(post) {
    setDraft(getDraftFromPost(post));
    setStatus("");
    setError("");
  }

  async function savePost(nextStatus = draft.status) {
    if (!user) {
      return;
    }

    setSaving(true);
    setStatus("");
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const isExisting = Boolean(draft.id);
      const response = await fetch(
        isExisting ? `/api/admin/blog/${draft.id}` : "/api/admin/blog",
        {
          method: isExisting ? "PATCH" : "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...draft,
            status: nextStatus,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not save blog post.");
      }

      setDraft(getDraftFromPost(data.post));
      await loadPosts();
      setStatus(nextStatus === "published" ? "Blog post published." : "Blog post saved.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePost() {
    if (!user || !draft.id) {
      return;
    }

    if (!window.confirm("Delete this blog post? This cannot be undone.")) {
      return;
    }

    setSaving(true);
    setStatus("");
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch(`/api/admin/blog/${draft.id}`, {
        method: "DELETE",
        headers,
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not delete blog post.");
      }

      startNewPost();
      await loadPosts();
      setStatus("Blog post deleted.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(event, field) {
    const file = event.target.files?.[0];

    if (!file || !user) {
      return;
    }

    setUploadingField(field);
    setError("");
    setStatus("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/blog/upload", {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not upload image.");
      }

      updateDraft(field, data.url);
      setStatus("Image uploaded.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setUploadingField("");
      event.target.value = "";
    }
  }

  async function importExistingStaticPosts() {
    if (!user) {
      return;
    }

    setImporting(true);
    setError("");
    setStatus("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/blog?action=import-static", {
        method: "POST",
        headers,
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not import existing blogs.");
      }

      const summary = data.summary || {};
      setStatus(
        `Import finished: ${summary.imported || 0} imported, ${summary.updated || 0} updated, ${summary.skipped || 0} skipped.`,
      );
      await loadPosts();
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setImporting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 text-[#111111]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-medium">Blog manager</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#858585]">
            Create, edit, publish, and upload images for public blog posts.
          </p>
        </div>
        <button
          type="button"
          onClick={startNewPost}
          className="border border-[#111111] px-4 py-2 text-sm font-medium"
        >
          New post
        </button>
      </div>

      {status ? <p className="mb-4 text-[var(--color-primary)]">{status}</p> : null}
      {error ? <p className="mb-4 text-[#d83f3f]">{error}</p> : null}

      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="border border-black/15 bg-white">
          <header className="flex items-center justify-between border-b border-black/10 px-4 py-4">
            <h2 className="text-xl font-medium">Posts</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={loading || importing}
                onClick={importExistingStaticPosts}
                className="text-sm underline disabled:opacity-50"
              >
                {importing ? "Importing..." : "Import existing blogs"}
              </button>
              <button
                type="button"
                disabled={loading || importing}
                onClick={loadPosts}
                className="text-sm underline disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </header>
          <div className="divide-y divide-black/10">
            {posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => editPost(post)}
                className={[
                  "block w-full px-4 py-4 text-left transition hover:bg-black/[0.03]",
                  draft.id === post.id ? "bg-black/[0.04]" : "",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <ImageThumb src={post.image} alt={post.imageAlt} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{post.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#858585]">
                      {post.status} · {post.topic} · {post.year}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#666666]">{post.image || "—"}</p>
                  </div>
                </div>
              </button>
            ))}
            {!posts.length && !loading ? (
              <p className="px-4 py-8 text-center text-[#858585]">
                No posts yet. Click “Import existing blogs” to bring current static blog posts
                into admin.
              </p>
            ) : null}
          </div>
        </section>

        <section className="border border-black/15 bg-white">
          <header className="border-b border-black/10 px-5 py-4">
            <h2 className="text-xl font-medium">
              {draft.id ? "Edit post" : "Create post"}
            </h2>
          </header>

          <div className="grid gap-5 p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Title</span>
                <input
                  value={draft.title}
                  onChange={(event) => updateDraft("title", event.target.value)}
                  className={inputClassName()}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Slug</span>
                <input
                  value={draft.slug}
                  onChange={(event) => updateDraft("slug", event.target.value)}
                  placeholder="my-blog-post"
                  className={inputClassName()}
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Topic</span>
                <input
                  value={draft.topic}
                  onChange={(event) => updateDraft("topic", event.target.value)}
                  className={inputClassName()}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Year</span>
                <input
                  value={draft.year}
                  onChange={(event) => updateDraft("year", event.target.value)}
                  className={inputClassName()}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Publish date</span>
                <input
                  type="date"
                  value={draft.publishDate}
                  onChange={(event) => updateDraft("publishDate", event.target.value)}
                  className={inputClassName()}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-[#858585]">Excerpt</span>
              <textarea
                value={draft.excerpt}
                onChange={(event) => updateDraft("excerpt", event.target.value)}
                rows={3}
                className={inputClassName("resize-none")}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Card image URL</span>
                <input
                  value={draft.image}
                  onChange={(event) => updateDraft("image", event.target.value)}
                  className={inputClassName()}
                />
                <ImagePreviewRow label="Card image" src={draft.image} alt={draft.imageAlt} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadImage(event, "image")}
                  className="text-sm"
                />
                {uploadingField === "image" ? (
                  <span className="text-xs text-[#858585]">Uploading card image...</span>
                ) : null}
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Hero image URL</span>
                <input
                  value={draft.heroImage}
                  onChange={(event) => updateDraft("heroImage", event.target.value)}
                  className={inputClassName()}
                />
                <ImagePreviewRow label="Hero image" src={draft.heroImage} alt={draft.heroImageAlt} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadImage(event, "heroImage")}
                  className="text-sm"
                />
                {uploadingField === "heroImage" ? (
                  <span className="text-xs text-[#858585]">Uploading hero image...</span>
                ) : null}
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Card image alt</span>
                <input
                  value={draft.imageAlt}
                  onChange={(event) => updateDraft("imageAlt", event.target.value)}
                  className={inputClassName()}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-[#858585]">Hero image alt</span>
                <input
                  value={draft.heroImageAlt}
                  onChange={(event) => updateDraft("heroImageAlt", event.target.value)}
                  className={inputClassName()}
                />
              </label>
            </div>

            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Body sections</h3>
                <button
                  type="button"
                  onClick={addBodySection}
                  className="border border-black/25 px-3 py-1.5 text-sm"
                >
                  Add section
                </button>
              </div>

              {draft.body.map((section, index) => (
                <div key={index} className="grid gap-3 border border-black/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">Section {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeBodySection(index)}
                      className="text-sm text-[#d83f3f] disabled:opacity-40"
                      disabled={draft.body.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    value={section.heading ?? ""}
                    onChange={(event) => updateBodySection(index, "heading", event.target.value)}
                    placeholder="Optional heading"
                    className={inputClassName()}
                  />
                  <textarea
                    value={section.body}
                    onChange={(event) => updateBodySection(index, "body", event.target.value)}
                    placeholder="Section body"
                    rows={5}
                    className={inputClassName("resize-none")}
                  />
                </div>
              ))}
            </section>

            <div className="flex flex-col gap-3 border-t border-black/10 pt-5 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-[#858585]">
                Current status: <span className="font-medium text-[#111111]">{draft.status}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {draft.id ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={deletePost}
                    className="border border-[#d83f3f] px-4 py-2 text-sm font-medium text-[#d83f3f] disabled:opacity-50"
                  >
                    Delete
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => savePost("draft")}
                  className="border border-[#111111] px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save draft"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => savePost("published")}
                  className="bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
