import Link from "next/link";
import { getAllQuestions } from "@/lib/content";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {

  const { category } = await params;

  const questions = getAllQuestions();

  const filtered = questions.filter(
    q => q.category === category
  );

  if (filtered.length === 0) {
    return notFound();
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">

      <a href="/" className="underline text-sm">
        ← Home
      </a>

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Category: {category}
      </h1>

      <ul className="space-y-4">

        {filtered.map(q => (
          <li
            key={q.slug}
            className="border rounded-lg p-4"
          >

            <Link
              href={`/questions/${q.slug}`}
              className="text-lg font-semibold underline"
            >
              {q.title}
            </Link>

            <div className="text-gray-400 text-sm">
              {q.difficulty}
            </div>

          </li>
        ))}

      </ul>

    </main>
  );
}