import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Section } from "@/components/ui/Section";
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
  return { title: post.title, description: post.excerpt };
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
          })}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {frontmatter.title}
        </h1>
        <div className="mt-6 leading-relaxed text-ink-700 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_a]:text-marigold-800 [&_a]:underline [&_a]:decoration-marigold-300 [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:hover:text-marigold-600">
          {content}
        </div>
      </article>
    </Section>
  );
}
