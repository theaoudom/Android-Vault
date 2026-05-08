import fs from "fs";
import path from "path";

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedSlug: string;
};

export type QuizData = {
  category: string;
  label: string;
  icon: string;
  questions: QuizQuestion[];
};

export type QuizCategory = {
  category: string;
  label: string;
  icon: string;
  questionCount: number;
};

const QUIZZES_DIR = path.join(process.cwd(), "content/quizzes");

export function getQuizCategories(): QuizCategory[] {
  const files = fs.readdirSync(QUIZZES_DIR).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(QUIZZES_DIR, file), "utf8");
    const data: QuizData = JSON.parse(raw);
    return {
      category: data.category,
      label: data.label,
      icon: data.icon,
      questionCount: data.questions.length,
    };
  });
}

export function getQuizByCategory(category: string): QuizData | null {
  const filePath = path.join(QUIZZES_DIR, `${category}.json`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const data: QuizData = JSON.parse(raw);
  return data;
}
