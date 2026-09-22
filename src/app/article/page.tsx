import type { Metadata } from "next";
import { getEnrichedArticle } from "@/lib/articles";
import ArticleClient from "./ArticleClient";

async function resolveArticle(post?: string) {
  const requested = post ? await getEnrichedArticle(post) : undefined;
  return requested ?? (await getEnrichedArticle("vibe-coding"))!;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}): Promise<Metadata> {
  const { post } = await searchParams;
  const article = await resolveArticle(post);

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const { post } = await searchParams;
  const article = await resolveArticle(post);

  return <ArticleClient article={article} />;
}
