import { getEnrichedArticles } from "@/lib/articles";
import { FEATURED_ORDER, MORE_WRITING_ORDER } from "@/lib/writing";
import BlogClient from "./BlogClient";

export default async function Blog() {
  const articles = await getEnrichedArticles();
  const featured = FEATURED_ORDER.map((slug) => articles[slug]);
  const posts = MORE_WRITING_ORDER.map((slug) => articles[slug]);

  return <BlogClient featured={featured} posts={posts} />;
}
