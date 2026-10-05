import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
};

export type PostSummary = PostFrontmatter & { slug: string };

export function getAllPosts(): PostSummary[] {
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.mdx$/, ""),
      ...(data as PostFrontmatter),
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSource(slug: string): string {
  return fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
}
