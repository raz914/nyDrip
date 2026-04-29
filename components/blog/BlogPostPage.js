import Image from "next/image";
import Link from "next/link";

import BlogCard from "@/components/blog/BlogCard";
import { ArrowRightIcon } from "@/components/home/icons";
import { sharedServiceNavLinks } from "@/components/navigation/nav-data";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M14 5h5v5M19 5 10 14M11 7H7.5A2.5 2.5 0 0 0 5 9.5v7A2.5 2.5 0 0 0 7.5 19h7a2.5 2.5 0 0 0 2.5-2.5V13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function BlogPostPage({ post, relatedPosts }) {
  return (
    <>
      <ServicesHeader links={sharedServiceNavLinks} />
      <main className="bg-white text-[#111111]">
        <section className="px-5 pb-20 pt-20 md:px-10 md:pb-[100px] md:pt-[100px]">
          <article className="mx-auto max-w-[706px]">
            <div className="relative h-[235px] overflow-hidden bg-[#f0f2f5] md:h-[368px]">
              <Image
                src={post.heroImage ?? post.image}
                alt={post.heroImageAlt ?? post.imageAlt}
                fill
                priority
                sizes="(min-width: 768px) 706px, 100vw"
                className={post.heroImageClassName ?? post.imageClassName ?? "object-cover"}
              />
            </div>

            <header className="mt-10 md:mt-10">
              <h1 className="text-[25px] font-medium leading-[1.25] text-[var(--color-primary)] md:text-[32px] md:leading-[46px]">
                {post.title}
              </h1>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-sm leading-5 text-[#858585] md:text-base">
                  {post.date} | {post.topic}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label="Copy article link"
                  className="text-[#111111] transition-colors hover:text-[var(--color-primary)]"
                >
                  <ShareIcon />
                </Link>
              </div>
            </header>

            <div className="mt-10 space-y-10 md:mt-10">
              {post.body.map((section) => (
                <section key={section.heading ?? section.body.slice(0, 48)}>
                  {section.heading ? (
                    <h2 className="mb-3 text-[23px] font-semibold leading-[1.25] md:text-[20px]">
                      {section.heading}
                    </h2>
                  ) : null}
                  <p className="text-[18px] leading-[1.6] text-[#111111] md:text-[20px] md:leading-[25px]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <Link
              href="/blog"
              className="mt-12 inline-flex items-center gap-2 text-base font-medium text-[var(--color-primary)] transition hover:opacity-70"
            >
              <span>Back to Blog</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </article>
        </section>

        <section className="px-5 pb-20 md:px-10 md:pb-[100px]">
          <div className="mx-auto max-w-[1512px]">
            <h2 className="text-center text-[32px] font-medium leading-none md:text-[36px]">
              Related Articles
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>

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
