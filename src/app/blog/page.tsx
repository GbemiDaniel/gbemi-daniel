import type { Metadata } from "next";
import { getEnrichedArticles } from "@/lib/articles";
import { FEATURED_ORDER, MORE_WRITING_ORDER } from "@/lib/writing";
import BlogClient from "./BlogClient";

const TITLE = "Writing";
const DESCRIPTION =
  "Posts, threads and notes from wherever I published them — collected from X, Dev.to, Medium and LinkedIn.";

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getEnrichedArticles();
  const image = articles[FEATURED_ORDER[0]]?.coverImage;

  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Blog() {
  const articles = await getEnrichedArticles();
  const featured = FEATURED_ORDER.map((slug) => articles[slug]);
  const posts = MORE_WRITING_ORDER.map((slug) => articles[slug]);

  return <BlogClient featured={featured} posts={posts} />;
}
