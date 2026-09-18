import { getEnrichedArticle } from "@/lib/articles";
import ArticleClient from "./ArticleClient";

export default async function ArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const { post } = await searchParams;
  const requested = post ? await getEnrichedArticle(post) : undefined;
  const article = requested ?? (await getEnrichedArticle("vibe-coding"))!;

  return <ArticleClient article={article} />;
}
