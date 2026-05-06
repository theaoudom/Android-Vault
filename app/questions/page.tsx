import { getAllQuestions } from "@/lib/content";
import SearchBox from "@/components/SearchBox";

export const metadata = {
  title: "All Questions | Android Vault",
  description: "Browse all Android interview questions and in-depth lessons across architecture, security, performance, and more.",
};

export default function QuestionsPage() {
  const questions = getAllQuestions();

  return (
    <main className="min-h-screen pb-16">
      {/* Page Header */}
      <div
        className="py-16 px-8 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">Knowledge Base</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            All Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            {questions.length} premium Android interview questions — from junior to senior level. Filter, search, and master every topic.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 pt-10">
        <SearchBox questions={questions} />
      </div>
    </main>
  );
}