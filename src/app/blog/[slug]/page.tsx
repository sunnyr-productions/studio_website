import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPostingSchema } from "@/lib/structured-data";
import { getAllPosts, getPostSource, type PostFrontmatter } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return {};
  const path = `/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: path,
      publishedTime: post.date,
      authors: ["Raul Patel"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let source: string;
  try {
    source = getPostSource(slug);
  } catch {
    notFound();
  }

  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source,
    options: { parseFrontmatter: true },
  });

  return (
    <Section pattern="waveform" className="pt-16">
      <JsonLd
        data={blogPostingSchema({
          slug,
          title: frontmatter.title,
          excerpt: frontmatter.excerpt,
          date: frontmatter.date,
        })}
      />
      <Link
        href="/blog"
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-periwinkle-700 transition-colors hover:text-periwinkle-900"
      >
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
          &larr;
        </span>
        Back to Blog
      </Link>

      <article className="animate-fade-up mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {frontmatter.title}
        </h1>
        <Prose className="mt-6">{content}</Prose>
      </article>
    </Section>
  );
}
