import Link from "next/link";
import { getAllQuestions } from "@/lib/content";

export const metadata = {
  title: "Categories | Android Vault",
  description: "Browse all Android interview question categories.",
};

const CATEGORY_ICONS: Record<string, string> = {
  architecture: "🏗️",
  components: "🧩",
  networking: "🌐",
  notifications: "🔔",
  performance: "⚡",
  security: "🔒",
};

export default function CategoriesPage() {
  const questions = getAllQuestions();

  const categoryMap = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.category] = (acc[q.category] ?? 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen pb-16">
      {/* Page Header */}
      <div
        className="py-16 px-8 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">Browse by</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Categories</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            {categories.length} topic areas covering every layer of modern Android development.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-5xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(([cat, count]) => (
            <Link
              key={cat}
              href={`/categories/${cat}`}
              className="group rounded-2xl p-6 transition-all duration-300 bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/25 hover:-translate-y-1"
            >
              <div className="text-3xl mb-4">
                {CATEGORY_ICONS[cat] ?? "📂"}
              </div>
              <h2 className="text-lg font-bold capitalize mb-2 group-hover:text-purple-300 transition-colors">
                {cat}
              </h2>
              <p className="text-sm text-gray-500">
                {count} question{count !== 1 ? "s" : ""}
              </p>
              <div
                className="mt-4 text-xs font-mono text-purple-500 group-hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
