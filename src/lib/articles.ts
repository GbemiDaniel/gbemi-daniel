import { cache } from "react";
import { ARTICLES, type Article } from "./writing";
import { getDevtoArticle } from "./devto";

async function enrich(article: Article): Promise<Article> {
  if (article.platform !== "devto") return article;
  const live = await getDevtoArticle(article.externalUrl);
  if (!live) return article;
  return {
    ...article,
    title: live.title,
    excerpt: live.excerpt,
    coverImage: live.coverImage,
    date: live.date,
    readTime: live.readTime,
  };
}

/**
 * Both wrapped in React's `cache` so a page and its `generateMetadata` (which
 * both need the same enriched data) share one call instead of hitting the
 * Dev.to API twice per request.
 */

/** All articles, with any Dev.to entries overlaid with their live data. */
export const getEnrichedArticles = cache(async (): Promise<Record<string, Article>> => {
  const enriched = await Promise.all(Object.values(ARTICLES).map(enrich));
  return Object.fromEntries(enriched.map((a) => [a.slug, a]));
});

export const getEnrichedArticle = cache(
  async (slug: string): Promise<Article | undefined> => {
    const article = ARTICLES[slug];
    if (!article) return undefined;
    return enrich(article);
  }
);
