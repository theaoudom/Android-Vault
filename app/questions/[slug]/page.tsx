import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

const QUESTIONS_DIR = path.join(process.cwd(), "content/questions");

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(fullPath));
    else if (entry.name.endsWith(".mdx")) files.push(fullPath);
  }
  return files;
}

function findFile(slug: string): string | null {
  const files = walk(QUESTIONS_DIR);
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);
    if (data.slug === slug) return file;
  }
  return null;
}

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  junior: { bg: "rgba(16,185,129,0.15)", text: "#34d399", label: "Junior" },
  mid:    { bg: "rgba(59,130,246,0.15)",  text: "#60a5fa", label: "Mid-Level" },
  senior: { bg: "rgba(139,92,246,0.15)", text: "#a78bfa", label: "Senior" },
};

export async function generateStaticParams() {
  const files = walk(QUESTIONS_DIR);
  return files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);
    return { slug: data.slug as string };
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = findFile(slug);
  if (!filePath) return notFound();

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const diff = DIFFICULTY_STYLES[data.difficulty] ?? {
    bg: "rgba(255,255,255,0.08)",
    text: "#9ca3af",
    label: data.difficulty,
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div
        className="py-12 px-8 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/questions"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Questions
          </Link>

          {/* Category & Difficulty */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest capitalize">{data.category}</span>
            <span className="text-gray-700">·</span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: diff.bg, color: diff.text }}
            >
              {diff.label}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-6">
            {data.title}
          </h1>

          {/* Tags */}
          {data.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((t: string) => (
                <Link
                  key={t}
                  href={`/tags/${t}`}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg hover:text-white transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#6b7280",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MDX Content */}
      <div className="max-w-3xl mx-auto px-8 pt-10">
        <article className="prose prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:rounded-xl prose-headings:font-bold prose-h2:text-xl prose-h3:text-base prose-code:text-purple-300 prose-a:text-blue-400">
          <MDXRemote source={content} />
        </article>

        {data.lastUpdated && (
          <div
            className="mt-12 pt-6 text-xs text-gray-600 font-mono"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            Last updated: {String(data.lastUpdated)}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/questions"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Questions
          </Link>
        </div>
      </div>
    </main>
  );
}