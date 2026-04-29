import BlogListing from "@/components/blog/BlogListing";
import { blogIntro, blogPosts, blogTopics, blogYears } from "@/components/blog/data";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import { sharedServiceNavLinks } from "@/components/navigation/nav-data";

export default function BlogPage() {
  return (
    <>
      <ServicesHeader links={sharedServiceNavLinks} />
      <main className="bg-white text-[#111111]">
        <BlogListing
          intro={blogIntro}
          posts={blogPosts}
          topics={blogTopics}
          years={blogYears}
        />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-20 md:px-10 md:py-20">
            <ServicesContactSection />
            <ServicesFooter />
          </div>
        </section>
      </main>
    </>
  );
}
