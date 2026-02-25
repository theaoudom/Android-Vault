"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";

type Question = {
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  tags: string[];
};

export default function SearchBox({
  questions,
}: {
  questions: Question[];
}) {

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const fuse = useMemo(
    () =>
      new Fuse(questions, {
        keys: ["title", "category", "tags"],
        threshold: 0.3,
      }),
    [questions]
  );

  let results = query
    ? fuse.search(query).map((r) => r.item)
    : questions;

  if (difficulty !== "all") {
    results = results.filter(
      (q) => q.difficulty === difficulty
    );
  }

  return (
    <div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search questions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4 bg-black text-white"
      />

      {/* Difficulty filter */}
      <div className="flex gap-2 mb-4">

        {["all", "junior", "mid", "senior"].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`border px-3 py-1 rounded-lg text-sm ${
              difficulty === d
                ? "bg-white text-black"
                : ""
            }`}
          >
            {d}
          </button>
        ))}

      </div>

      {/* Results */}
      <ul className="space-y-4">
        {results.map((q) => (
          <li key={q.slug} className="border rounded-xl p-5 hover:bg-white/5 transition">
            <div className="flex items-start justify-between gap-4">
              <div>
                <a href={`/questions/${q.slug}`} className="text-lg font-semibold underline">
                  {q.title}
                </a>

                <div className="text-xs text-gray-500 mt-1">
                  {q.category} • {q.difficulty}
                </div>
              </div>

              <a
                href={`/questions/${q.slug}`}
                className="text-sm border px-3 py-1 rounded-lg"
              >
                Open
              </a>
            </div>

            {/* Quick Answer preview */}
            {"excerpt" in q && (q as any).excerpt ? (
              <p className="text-sm text-gray-200 mt-3 leading-6">
                {(q as any).excerpt}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2 mt-3">
              {q.tags.map((t) => (
                <a
                  key={t}
                  href={`/tags/${t}`}
                  className="border px-2 py-1 rounded-md text-xs"
                >
                  {t}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}