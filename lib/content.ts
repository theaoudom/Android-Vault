import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Question = {
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  tags: string[];
  lastUpdated?: string;
  filePath: string;
  excerpt: string;
};

const QUESTIONS_DIR = path.join(process.cwd(), "content/questions");

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".mdx")) files.push(fullPath);
  }

  return files;
}

function extractQuickAnswerExcerpt(mdxContent: string): string {
  // Find section "## Quick Interview Answer"
  const marker = "## Quick Interview Answer";
  const idx = mdxContent.indexOf(marker);
  if (idx === -1) return "";

  const after = mdxContent.slice(idx + marker.length).trim();

  // stop at next heading "## "
  const nextHeadingIdx = after.indexOf("\n## ");
  const section = (nextHeadingIdx === -1 ? after : after.slice(0, nextHeadingIdx)).trim();

  // remove code fences for preview
  const noCode = section.replace(/```[\s\S]*?```/g, "").trim();

  // take first ~220 chars
  return noCode.length > 220 ? noCode.slice(0, 220) + "..." : noCode;
}

export function getAllQuestions(): Question[] {
  const files = walk(QUESTIONS_DIR);

  const all = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    return {
      title: String(data.title ?? ""),
      slug: String(data.slug ?? ""),
      category: String(data.category ?? ""),
      difficulty: String(data.difficulty ?? "junior"),
      tags: (data.tags ?? []) as string[],
      lastUpdated: data.lastUpdated ? String(data.lastUpdated) : undefined,
      filePath,
      excerpt: extractQuickAnswerExcerpt(content),
    } satisfies Question;
  });

  return all.sort((a, b) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? ""));
}