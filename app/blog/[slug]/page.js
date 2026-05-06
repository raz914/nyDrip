import { notFound } from "next/navigation";

import BlogPostPage from "@/components/blog/BlogPostPage";
import {
  getPublishedBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/blogPosts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog | DripLounge",
    };
  }

  return {
    title: `${post.title} | DripLounge`,
    description: post.excerpt,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPage post={post} relatedPosts={await getRelatedBlogPosts(slug)} />;
}
