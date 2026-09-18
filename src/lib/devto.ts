export type DevtoData = {
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readTime: string;
};

const DEVTO_URL_RE = /^https:\/\/dev\.to\/([^/]+)\/([^/?#]+)/;

/**
 * Pulls live title/excerpt/cover/date straight from Dev.to's public API, so
 * this site's copy can't drift from what's actually published there. Returns
 * null on any failure (bad URL, network error, post removed) — callers fall
 * back to the static copy in writing.ts rather than breaking the page.
 */
export async function getDevtoArticle(externalUrl: string): Promise<DevtoData | null> {
  const match = externalUrl.match(DEVTO_URL_RE);
  if (!match) return null;
  const [, username, slug] = match;

  try {
    const res = await fetch(`https://dev.to/api/articles/${username}/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.title || !data.cover_image) return null;

    return {
      title: data.title,
      excerpt: data.description ?? "",
      coverImage: data.cover_image,
      date: data.readable_publish_date ?? "",
      readTime: `${data.reading_time_minutes ?? 1} min`,
    };
  } catch {
    return null;
  }
}
