import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function safeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")     // remove symbols
    .replace(/\s+/g, "-")            // spaces -> dash
    .replace(/-+/g, "-");            // collapse
}

function escapeYaml(str: string) {
  return String(str).replace(/"/g, '\\"');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body.title ?? "").trim();
    const category = String(body.category ?? "general").trim().toLowerCase();
    const difficulty = String(body.difficulty ?? "mid").trim().toLowerCase();
    const tags: string[] = Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t))
        : [];
    const answer = String(body.answer ?? "").trim();

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!answer) return NextResponse.json({ error: "Answer is required" }, { status: 400 });

    const slug = safeSlug(body.slug?.trim?.() ? body.slug : title);

    const baseDir = path.join(process.cwd(), "content/questions", category);
    fs.mkdirSync(baseDir, { recursive: true });

    const filePath = path.join(baseDir, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const mdx = `---
title: "${escapeYaml(title)}"
slug: "${escapeYaml(slug)}"
category: "${escapeYaml(category)}"
difficulty: "${escapeYaml(difficulty)}"
tags: [${tags.map((t: string) => `"${escapeYaml(t)}"`).join(", ")}]
lastUpdated: "${new Date().toISOString().slice(0, 10)}"
---

## Quick Interview Answer
${answer}
`;

    fs.writeFileSync(filePath, mdx, "utf8");

    return NextResponse.json({ ok: true, slug, filePath });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}