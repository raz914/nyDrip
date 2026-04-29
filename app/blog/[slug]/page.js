import { notFound } from "next/navigation";

import BlogPostPage from "@/components/blog/BlogPostPage";
import {
  getBlogPostBySlug,
  getBlogSlugs,
  getRelatedPosts,
} from "@/components/blog/data";

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

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
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPage post={post} relatedPosts={getRelatedPosts(slug)} />;
}
