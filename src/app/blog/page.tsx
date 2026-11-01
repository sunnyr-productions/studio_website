import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog: Recording, Mixing & Learning Music",
  description: "Plain-English notes on recording, mixing, mastering, gear, and learning music.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section pattern="dots" space="page">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
        Blog
      </h1>
      <p
        className="mt-3 max-w-xl leading-relaxed text-ink-700"
      >
        Notes on recording, mixing, gear and learning music.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {posts.map((post, i) => (
          <div key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <Card accent={i % 2 === 0 ? "marigold" : "periwinkle"} interactive className="h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-ink-900">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{post.excerpt}</p>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
