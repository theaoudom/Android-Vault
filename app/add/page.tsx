"use client";

import { useState } from "react";

export default function AddQuestionPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("networking");
  const [difficulty, setDifficulty] = useState("mid");
  const [tagsText, setTagsText] = useState("retrofit, okhttp");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<string>("");

  async function onSave() {
    setStatus("Saving...");

    const tags = tagsText
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, category, difficulty, tags, answer }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(`❌ ${data.error || "Failed"}`);
      return;
    }

    setStatus(`✅ Saved! /questions/${data.slug}`);
    setTitle("");
    setSlug("");
    setTagsText("");
    setAnswer("");
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Interview Question</h1>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-400">Title</label>
          <input
            className="w-full border rounded-lg p-2 bg-black text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. NotificationChannel importance"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Slug (optional)</label>
          <input
            className="w-full border rounded-lg p-2 bg-black text-white"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. notification-channel-importance"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-400">Category</label>
            <input
              className="w-full border rounded-lg p-2 bg-black text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="networking / security / notifications ..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Difficulty</label>
            <select
              className="w-full border rounded-lg p-2 bg-black text-white"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="junior">junior</option>
              <option value="mid">mid</option>
              <option value="senior">senior</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Tags (comma)</label>
            <input
              className="w-full border rounded-lg p-2 bg-black text-white"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="retrofit, okhttp"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Quick Interview Answer</label>
          <textarea
            className="w-full border rounded-lg p-2 bg-black text-white min-h-[160px]"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write the quick answer you want to store..."
          />
        </div>

        <button
          onClick={onSave}
          className="border px-4 py-2 rounded-lg"
        >
          Save
        </button>

        {status && <p className="text-sm mt-2">{status}</p>}
      </div>
    </main>
  );
}