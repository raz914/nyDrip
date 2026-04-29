import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/home/icons";

export default function BlogCard({ post, priority = false }) {
  return (
    <article className="bg-[#f0f2f5]">
      <Link
        href={`/blog/${post.slug}`}
        className="group block"
        aria-label={`Read ${post.title}`}
      >
        <div className="relative h-[223px] overflow-hidden bg-[#f0f2f5]">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 464px, 100vw"
            className={[
              "transition-transform duration-300 group-hover:scale-[1.03]",
              post.imageClassName ?? "object-cover",
            ].join(" ")}
          />
        </div>
        <div className="min-h-[220px] px-5 pb-5 pt-5 md:min-h-[214px]">
          <h2 className="line-clamp-2 text-[20px] font-medium leading-[1.25] text-[#111111] md:text-[22px]">
            {post.title}
          </h2>
          <p className="mt-3 text-sm leading-5 text-[#858585] md:text-base">
            {post.date} | {post.topic}
          </p>
          <p className="mt-3 line-clamp-3 text-base leading-6 text-[#2c2c2e]">
            {post.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-base font-medium text-[var(--color-primary)]">
            <span>Read More</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
