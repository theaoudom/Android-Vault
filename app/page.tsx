import Link from "next/link";
import { getAllQuestions } from "@/lib/content";

export default function HomePage() {

  const questions = getAllQuestions();

  const categories = Array.from(
    new Set(questions.map(q => q.category))
  );

  const latest = questions.slice(0, 5);

  return (
    <main className="p-8 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-2">
        Android Vault
      </h1>

      <p className="text-gray-400 mb-8">
        Android Interview Questions & Knowledge Base
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">

        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {questions.length}
          </div>
          <div className="text-gray-400">
            Questions
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {categories.length}
          </div>
          <div className="text-gray-400">
            Categories
          </div>
        </div>

      </div>

      {/* Categories */}
      <h2 className="text-xl font-semibold mb-3">
        Categories
      </h2>

      <div className="flex flex-wrap gap-2 mb-8">

        {categories.map(cat => (
          <Link
            key={cat}
            href={`/categories/${cat}`}
            className="border px-3 py-1 rounded-lg text-sm inline-block"
          >
            {cat}
          </Link>
        ))}

      </div>

      {/* Latest */}
      <h2 className="text-xl font-semibold mb-3">
        Latest Questions
      </h2>

      <ul className="space-y-3 mb-8">

        {latest.map(q => (
          <li key={q.slug}>

            <Link
              href={`/questions/${q.slug}`}
              className="underline"
            >
              {q.title}
            </Link>

          </li>
        ))}

      </ul>

      <Link
        href="/questions"
        className="border px-4 py-2 rounded-lg inline-block"
      >
        Browse All Questions →
      </Link>

    </main>
  );
}