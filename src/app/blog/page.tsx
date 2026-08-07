import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog & Resources",
  description: "Notes on recording, mixing, and mastering.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section pattern="dots" className="pt-16">
      <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
        Blog &amp; Resources
      </h1>
      <p style={{ animationDelay: "80ms" }} className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700">
        Notes on recording, mixing, and gear — written for musicians, not other engineers.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 70}>
            <Link href={`/blog/${post.slug}`}>
              <Card accent={i % 2 === 0 ? "marigold" : "periwinkle"} className="h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-ink-900">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{post.excerpt}</p>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
