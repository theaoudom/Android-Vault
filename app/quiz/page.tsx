import Link from "next/link";
import { getQuizCategories } from "@/lib/quiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz | Android Vault",
  description:
    "Test your Android development knowledge with interactive quizzes. Choose a category and answer 10 multiple-choice questions to see how you score.",
  openGraph: {
    title: "Quiz | Android Vault",
    description:
      "Test your Android development knowledge with interactive quizzes across 7 categories.",
  },
};

export default function QuizPage() {
  const categories = getQuizCategories();

  return (
    <main className="min-h-screen pb-16">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-secondary blur-[120px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="relative z-10">
          <div className="text-6xl mb-6">🧪</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Test Your <span className="text-gradient">Knowledge</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            Pick a category, answer 10 questions, and see how well you know
            Android development.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <div className="max-w-4xl mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`/quiz/${cat.category}`}
              className="group glass-panel rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h2 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                {cat.label}
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                {cat.questionCount} Questions
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-medium">
                Start Quiz
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-12 text-center">
          <div className="glass-panel rounded-2xl p-6 inline-block max-w-lg">
            <p className="text-sm text-gray-400 leading-relaxed">
              <span className="text-white font-semibold">How it works:</span>{" "}
              Each quiz has 10 multiple-choice questions with 3 options.
              Answer all questions and get your score with detailed explanations
              and links to full lessons.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
