import { getAllPosts } from "@/lib/blog";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  return renderOgImage({
    eyebrow: "FROM THE BLOG",
    title: post?.title ?? "The sunny*r Studio blog",
    accent: "periwinkle",
  });
}
