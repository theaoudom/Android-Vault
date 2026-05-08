"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedSlug: string;
};

type QuizPlayerProps = {
  category: string;
  label: string;
  questions: QuizQuestion[];
};

function shuffleOptions(question: QuizQuestion): {
  shuffledOptions: string[];
  correctShuffledIndex: number;
} {
  const indices = question.options.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledOptions = indices.map((i) => question.options[i]);
  const correctShuffledIndex = indices.indexOf(question.correctIndex);
  return { shuffledOptions, correctShuffledIndex };
}

function shuffleArray<T>(array: T[]): T[] {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function QuizPlayer({ category, label, questions }: QuizPlayerProps) {
  // Use state for shuffled questions to avoid hydration mismatch
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>(questions);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Shuffle questions and their options once on client mount
    const randomized = shuffleArray(questions).map((q) => {
      const { shuffledOptions, correctShuffledIndex } = shuffleOptions(q);
      return { ...q, options: shuffledOptions, correctIndex: correctShuffledIndex };
    });
    setShuffledQuestions(randomized);
  }, [questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [phase, setPhase] = useState<"playing" | "answered" | "results">("playing");

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (phase !== "playing") return;
      setSelectedAnswer(optionIndex);
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = optionIndex;
        return next;
      });
      setPhase("answered");
    },
    [phase, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      setPhase("results");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setPhase("playing");
    }
  }, [currentIndex, questions.length]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers(Array(questions.length).fill(null));
    setPhase("playing");
  }, [questions.length]);

  if (!isMounted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-white/10 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-white/10 rounded mb-2"></div>
          <div className="h-3 w-32 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  const current = shuffledQuestions[currentIndex];
  const isCorrect = selectedAnswer === current?.correctIndex;
  const score = answers.reduce<number>((acc, ans, i) => {
    return acc + (ans === shuffledQuestions[i].correctIndex ? 1 : 0);
  }, 0);

  const progressPercent = ((currentIndex + (phase === "answered" ? 1 : 0)) / questions.length) * 100;

  // ─── Results Screen ─────────────────────────────────────────────
  if (phase === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    let messageColor = "";
    if (percentage >= 90) {
      message = "🏆 Excellent!";
      messageColor = "#10b981";
    } else if (percentage >= 70) {
      message = "👏 Great job!";
      messageColor = "#8b5cf6";
    } else if (percentage >= 50) {
      message = "👍 Not bad!";
      messageColor = "#3b82f6";
    } else {
      message = "📚 Keep studying!";
      messageColor = "#ef4444";
    }

    // Calculate the circumference and offset for the score ring
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="max-w-3xl mx-auto px-6">
        {/* Score Circle */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={messageColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="quiz-score-ring"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black" style={{ color: messageColor }}>
                {score}/{questions.length}
              </span>
              <span className="text-sm text-gray-400 font-medium">{percentage}%</span>
            </div>
          </div>
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: messageColor }}
          >
            {message}
          </h2>
          <p className="text-gray-400 text-lg">
            You scored {score} out of {questions.length} on {label}
          </p>
        </div>

        {/* Question Breakdown */}
        <div className="space-y-4 mb-12">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-1 bg-primary rounded-full"></span>
            Question Breakdown
          </h3>
          {shuffledQuestions.map((q, i) => {
            const userAnswer = answers[i];
            const wasCorrect = userAnswer === q.correctIndex;
            return (
              <div
                key={q.id}
                className="glass-panel rounded-xl p-5"
                style={{
                  borderColor: wasCorrect
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(239, 68, 68, 0.3)",
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xl mt-0.5">{wasCorrect ? "✅" : "❌"}</span>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Your answer: </span>
                      <span
                        className={wasCorrect ? "text-emerald-400" : "text-red-400"}
                      >
                        {userAnswer !== null ? q.options[userAnswer] : "Skipped"}
                      </span>
                    </p>
                    {!wasCorrect && (
                      <p className="text-sm mt-1">
                        <span className="text-gray-500">Correct: </span>
                        <span className="text-emerald-400">
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2 italic">{q.explanation}</p>
                  </div>
                </div>
                <div className="ml-8">
                  <Link
                    href={`/questions/${q.relatedSlug}`}
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1"
                  >
                    Read full lesson →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-16">
          <button
            onClick={handleRetry}
            className="glass-panel px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            🔄 Retry Quiz
          </button>
          <Link
            href="/quiz"
            className="glass-panel px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            📂 Try Another Category
          </Link>
        </div>
      </div>
    );
  }

  // ─── Quiz Playing Screen ────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400 font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-mono text-gray-500">
            {label}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="quiz-progress-bar h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel rounded-2xl p-8 mb-8 quiz-question-enter">
        <div className="flex items-center gap-3 mb-6">
          <span className="glass-panel w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-primary">
            {currentIndex + 1}
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
          {current.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {current.options.map((option, i) => {
          let stateClass = "quiz-option";
          if (phase === "answered") {
            if (i === current.correctIndex) {
              stateClass += " quiz-correct";
            } else if (i === selectedAnswer && !isCorrect) {
              stateClass += " quiz-wrong";
            } else {
              stateClass += " quiz-dimmed";
            }
          }

          const letter = String.fromCharCode(65 + i); // A, B, C

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={phase === "answered"}
              className={`w-full text-left glass-panel rounded-xl p-5 transition-all duration-300 group ${stateClass}`}
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300"
                  style={{
                    background:
                      phase === "answered" && i === current.correctIndex
                        ? "rgba(16, 185, 129, 0.2)"
                        : phase === "answered" && i === selectedAnswer && !isCorrect
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(255,255,255,0.05)",
                    color:
                      phase === "answered" && i === current.correctIndex
                        ? "#10b981"
                        : phase === "answered" && i === selectedAnswer && !isCorrect
                        ? "#ef4444"
                        : "#9ca3af",
                  }}
                >
                  {phase === "answered" && i === current.correctIndex
                    ? "✓"
                    : phase === "answered" && i === selectedAnswer && !isCorrect
                    ? "✗"
                    : letter}
                </span>
                <span className="text-base font-medium">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation + Next Button (shown after answering) */}
      {phase === "answered" && (
        <div className="quiz-explanation-enter">
          <div
            className="rounded-xl p-5 mb-6"
            style={{
              background: isCorrect
                ? "rgba(16, 185, 129, 0.08)"
                : "rgba(239, 68, 68, 0.08)",
              border: `1px solid ${
                isCorrect ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"
              }`,
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? "#10b981" : "#ef4444" }}>
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">{current.explanation}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="glass-panel px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2 group"
            >
              {currentIndex >= questions.length - 1 ? "View Results" : "Next Question"}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
