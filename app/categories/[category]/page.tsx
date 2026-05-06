import Link from "next/link";
import { getAllQuestions } from "@/lib/content";
import { notFound } from "next/navigation";
import SearchBox from "@/components/SearchBox";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const questions = getAllQuestions();
  const filtered = questions.filter((q) => q.category === category);

  if (filtered.length === 0) {
    return notFound();
  }

  return (
    <main className="min-h-screen pb-16">
      {/* Page Header */}
      <div
        className="py-16 px-8 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            All Categories
          </Link>
          
          <p className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">Category</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 capitalize">
            {category}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            {filtered.length} premium questions related to {category}.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 pt-10">
        <SearchBox questions={filtered} />
      </div>
    </main>
  );
}