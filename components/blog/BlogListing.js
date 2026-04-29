"use client";

import { useMemo, useState } from "react";

import BlogCard from "@/components/blog/BlogCard";
import { ArrowRightIcon } from "@/components/home/icons";

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="relative inline-flex h-11 min-w-[101px] items-center border border-black/10 bg-white">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full appearance-none bg-transparent py-2 pl-5 pr-11 text-base text-[#111111] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All" ? label : option}
          </option>
        ))}
      </select>
      <ArrowRightIcon className="pointer-events-none absolute right-2.5 h-6 w-6 text-[#111111]" />
    </label>
  );
}

export default function BlogListing({ intro, posts, topics, years }) {
  const [topic, setTopic] = useState("All");
  const [year, setYear] = useState("All");

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesTopic = topic === "All" || post.topic === topic;
        const matchesYear = year === "All" || post.year === year;

        return matchesTopic && matchesYear;
      }),
    [posts, topic, year],
  );

  return (
    <>
      <section className="px-5 pb-10 pt-20 md:px-10 md:pb-[60px] md:pt-[100px]">
        <div className="mx-auto grid max-w-[1512px] gap-14 md:grid-cols-[minmax(0,706px)_minmax(224px,1fr)] md:items-end md:gap-10">
          <div>
            <h1 className="text-[46px] font-medium leading-none md:text-[52px]">
              {intro.title}
            </h1>
            <p className="mt-3 max-w-[706px] text-base leading-6 text-[#2c2c2e] md:mt-0 md:text-[20px] md:leading-[25px]">
              {intro.description}
            </p>
          </div>
          <div className="flex gap-3 md:justify-end">
            <FilterSelect
              label="Topic"
              value={topic}
              options={topics}
              onChange={setTopic}
            />
            <FilterSelect label="Year" value={year} options={years} onChange={setYear} />
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 pt-5 md:px-10 md:pb-[100px] md:pt-10">
        <div className="mx-auto max-w-[1512px]">
          {filteredPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="border border-black/10 px-5 py-12 text-center">
              <h2 className="text-2xl font-medium text-[#111111]">No posts found</h2>
              <p className="mt-2 text-base text-[#858585]">
                Try a different topic or year.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
