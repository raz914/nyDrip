import BlogPage from "@/components/blog/BlogPage";
import { getBlogTopics, getBlogYears, getPublishedBlogPosts } from "@/lib/blogPosts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Health Insights | DripLounge",
  description:
    "Read wellness insights, beauty trends, lifestyle tips, and IV therapy education from NY Drip Lounge.",
};

export default async function Page() {
  const posts = await getPublishedBlogPosts();

  return (
    <BlogPage
      posts={posts}
      topics={getBlogTopics(posts)}
      years={getBlogYears(posts)}
    />
  );
}
