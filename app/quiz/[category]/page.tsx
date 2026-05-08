import { notFound } from "next/navigation";
import { getQuizByCategory, getQuizCategories } from "@/lib/quiz";
import QuizPlayer from "@/components/QuizPlayer";
import type { Metadata } from "next";
import Link from "next/link";

type Params = { category: string };

export async function generateStaticParams() {
  const categories = getQuizCategories();
  return categories.map((c) => ({ category: c.category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const quiz = getQuizByCategory(category);
  if (!quiz) return {};

  return {
    title: `${quiz.label} Quiz | Android Vault`,
    description: `Test your ${quiz.label} knowledge with ${quiz.questions.length} multiple-choice questions. Get instant feedback and learn from detailed explanations.`,
    openGraph: {
      title: `${quiz.label} Quiz | Android Vault`,
      description: `Challenge yourself with ${quiz.questions.length} ${quiz.label} questions on Android Vault.`,
    },
  };
}

export default async function QuizCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const quiz = getQuizByCategory(category);

  if (!quiz) notFound();

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <div
        className="pt-28 pb-10 px-8 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-10 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            All Categories
          </Link>
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4">{quiz.icon}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
              {quiz.label} <span className="text-gradient">Quiz</span>
            </h1>
            <p className="text-gray-400">
              {quiz.questions.length} questions · Multiple choice · Instant feedback
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Player */}
      <div className="max-w-5xl mx-auto px-8 pt-10">
        <QuizPlayer
          category={quiz.category}
          label={quiz.label}
          questions={quiz.questions}
        />
      </div>
    </main>
  );
}
