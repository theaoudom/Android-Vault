import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

const QUESTIONS_DIR = path.join(process.cwd(), "content/questions");

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function findFile(slug: string): string | null {
  const files = walk(QUESTIONS_DIR);

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);

    if (data.slug === slug) {
      return file;
    }
  }

  return null;
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

  return (
    <main className="p-6 max-w-3xl mx-auto">

      <a href="/questions" className="underline text-sm">
        ← Back
      </a>

      <h1 className="text-3xl font-bold mt-4">
        {data.title}
      </h1>

      <div className="text-gray-500 text-sm mb-6">
        {data.category} • {data.difficulty}
      </div>

        <div className="flex flex-wrap gap-2 mb-6">
            {(data.tags ?? []).map((t: string) => (
                <a
                key={t}
                href={`/tags/${t}`}
                className="border px-2 py-1 rounded-md text-xs"
                >
                {t}
                </a>
            ))}
        </div>

      <article className="prose prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:rounded-xl">
        <MDXRemote source={content} />
      </article>

      {data.lastUpdated ? (
        <div className="text-xs text-gray-500 mb-6">
          Updated: {String(data.lastUpdated)}
        </div>
      ) : null}

    </main>
  );
}