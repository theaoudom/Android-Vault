"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

type Question = {
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  tags: string[];
};

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  junior: { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399" },
  mid: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" },
  senior: { bg: "rgba(139, 92, 246, 0.15)", text: "#a78bfa" },
};

export default function SearchBox({ questions }: { questions: Question[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const fuse = useMemo(
    () => new Fuse(questions, { keys: ["title", "category", "tags"], threshold: 0.35 }),
    [questions]
  );

  let results = query ? fuse.search(query).map((r) => r.item) : questions;
  if (difficulty !== "all") {
    results = results.filter((q) => q.difficulty === difficulty);
  }

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by title, category, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(139,92,246,0.5)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Difficulty Filter Pills */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-xs text-gray-500 font-mono uppercase tracking-wider mr-1">Level:</span>
        {["all", "junior", "mid", "senior"].map((d) => {
          const isActive = difficulty === d;
          const color = DIFFICULTY_COLORS[d];
          return (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200"
              style={{
                background: isActive ? (color?.bg ?? "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.04)",
                color: isActive ? (color?.text ?? "#fff") : "#6b7280",
                border: `1px solid ${isActive ? (color?.text ?? "rgba(255,255,255,0.3)") : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {d}
            </button>
          );
        })}

        <span className="ml-auto text-xs text-gray-500 font-mono">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>No questions found. Try a different search.</p>
          </div>
        ) : (
          results.map((q) => {
            const dc = DIFFICULTY_COLORS[q.difficulty];
            return (
              <Link
                key={q.slug}
                href={`/questions/${q.slug}`}
                className="block rounded-2xl p-6 transition-all duration-200 group bg-white/[0.03] border border-white/[0.07] hover:bg-purple-500/[0.06] hover:border-purple-500/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors leading-snug">
                      {q.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 capitalize font-mono">{q.category}</span>
                      <span className="text-gray-600">·</span>
                      <span
                        className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full"
                        style={{ background: dc?.bg ?? "rgba(255,255,255,0.08)", color: dc?.text ?? "#9ca3af" }}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-600 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>

                {/* Tags */}
                {q.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {q.tags.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-md font-mono"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}