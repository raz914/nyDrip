export const blogIntro = {
  title: "Health Insights",
  description:
    "your go-to source for wellness insights, beauty trends, and lifestyle inspiration. Here, we share tips, research, and stories that may help you feel informed, empowered, and inspired on your journey to looking and feeling your best. From IV therapy and peptides to self-care routines and industry updates, our blog is designed to keep you connected to the latest in health, vitality, and modern living.",
};

const metabolismArticleBody = [
  {
    body: "If you're in New York or the Hudson Valley and you're serious about your metabolism, energy, and wellness, you've probably asked: Should I keep taking oral supplements, or is it time to upgrade to IV therapy in New York? At NY Drip Lounge we see this question every day. The quick answer: both have their place but when speed and results matter, IV therapy often wins.",
  },
  {
    heading: "Why metabolism matters in places like NYC & Hudson Valley",
    body: "Your metabolism isn't just about how many calories you burn. It's how efficiently your body uses nutrients, how well your cells repair themselves, and how optimized you feel. In fast-paced cities like New York or active regions like the Hudson Valley, high stress, travel, and busy schedules hurt metabolic health. That's why optimized nutrition matters more than ever.",
  },
  {
    heading: "The science of absorption: IV therapy vs oral supplements",
    body: "One of the biggest differences between oral supplements and IV therapy is bioavailability: how much of the nutrient your body actually absorbs. Studies show that many oral vitamins may only deliver 10-50% of their value, depending on digestion, gut health, and other factors. In contrast, IV therapy delivers nutrients directly to your bloodstream, bypassing the digestive system entirely. That means nearly 100% absorption, faster results, and more predictable outcomes. When your metabolism needs a jump-start, whether due to travel, workout overload, or a busy job, faster absorption translates into faster recovery, clearer energy, and better metabolic performance.",
  },
  {
    heading: "When oral supplements still make sense",
    body: "Oral vitamins and minerals absolutely have their place. For everyday maintenance, they're convenient, cost-effective, and widely available. If you're on a budget, taking a high-quality multivitamin plus mineral supplement daily and focusing on diet, sleep, and exercise is still smart. Some dietitians note that for generally healthy individuals, oral nutrition plus lifestyle may suffice. But if you have signs of metabolic sluggishness, low energy, plateaued workouts, high travel demands, or digestive issues, then the limitations of oral supplements become clear.",
  },
];

export const blogPosts = [
  {
    slug: "iv-therapy-vs-supplements-metabolism",
    title: "IV Therapy vs Supplements: What Works Faster for Metabolism?",
    date: "Oct 27, 2025",
    topic: "In the News",
    year: "2025",
    image: "/blog/iv-therapy-consultation-thumbnail.png",
    imageAlt: "A wellness provider consulting with an older client at home",
    imageClassName: "object-cover object-bottom",
    heroImage: "/blog/iv-therapy-consultation-hero.png",
    heroImageAlt: "A wellness provider discussing IV therapy with an older client",
    heroImageClassName: "object-cover",
    excerpt:
      "Your metabolism isn't just about how many calories you burn. It's how efficiently your body uses nutrients, how well your cells repair themselves, and how optimized you feel...",
    body: metabolismArticleBody,
  },
  {
    slug: "mobile-iv-therapy-new-york",
    title: "Why Mobile IV Therapy Is Booming in New York",
    date: "Oct 27, 2025",
    topic: "Wellness",
    year: "2025",
    image: "/blog/wellness-stretch-thumbnail.jpg",
    imageAlt: "A woman stretching near the water at sunrise",
    imageClassName: "object-cover",
    excerpt:
      "Busy schedules, travel, and wellness-focused routines are changing how New Yorkers approach hydration, recovery, and nutrient support...",
    body: metabolismArticleBody,
  },
  {
    slug: "beauty-wellness-radiance-iv",
    title: "Beauty and Wellness: How Radiance IV Supports Your Routine",
    date: "Oct 27, 2025",
    topic: "Beauty",
    year: "2025",
    image: "/blog/telehealth-consultation-thumbnail.png",
    imageAlt: "A woman smiling during a telehealth consultation",
    imageClassName: "object-cover",
    excerpt:
      "Modern self-care blends hydration, antioxidants, and steady lifestyle habits that may help support skin clarity, energy, and confidence...",
    body: metabolismArticleBody,
  },
  {
    slug: "energy-support-busy-weeks",
    title: "Energy Support for Busy Weeks, Travel, and Recovery",
    date: "Sep 18, 2025",
    topic: "Lifestyle",
    year: "2025",
    image: "/blog/iv-therapy-consultation-thumbnail.png",
    imageAlt: "A wellness provider consulting with an older client at home",
    imageClassName: "object-cover object-bottom",
    excerpt:
      "When your schedule gets intense, targeted hydration and nutrient support may help you stay clear, focused, and better prepared...",
    body: metabolismArticleBody,
  },
  {
    slug: "seasonal-wellness-immune-support",
    title: "Seasonal Wellness Tips for Immune Support",
    date: "Aug 12, 2024",
    topic: "Wellness",
    year: "2024",
    image: "/blog/wellness-stretch-thumbnail.jpg",
    imageAlt: "A woman stretching near the water at sunrise",
    imageClassName: "object-cover",
    excerpt:
      "From hydration to sleep and nutrient consistency, small decisions can support immune readiness through seasonal changes...",
    body: metabolismArticleBody,
  },
];

export const blogTopics = ["All", ...new Set(blogPosts.map((post) => post.topic))];
export const blogYears = ["All", ...new Set(blogPosts.map((post) => post.year))];

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogSlugs() {
  return blogPosts.map((post) => post.slug);
}

export function getRelatedPosts(slug, limit = 3) {
  return blogPosts.filter((post) => post.slug !== slug).slice(0, limit);
}
