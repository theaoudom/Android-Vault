import Link from "next/link";
import { getAllQuestions } from "@/lib/content";
import NewFeatureModal from "@/components/NewFeatureModal";

export default function HomePage() {
  const questions = getAllQuestions();
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const latest = questions.slice(0, 5);

  return (
    <main className="min-h-screen pb-16">
      <NewFeatureModal />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-primary blur-[120px] rounded-full mix-blend-screen"></div>
        </div>
        
        <div className="relative z-10 animate-float">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Android <span className="text-gradient">Vault</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate knowledge base and premium interview questions for modern Android Engineers.
          </p>
          <Link
            href="/questions"
            className="glass-panel px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2 group"
          >
            Start Exploring
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 -mt-8 relative z-20">
          <div className="glass-panel rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl font-black text-primary mb-2">{questions.length}</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Questions</div>
          </div>
          <div className="glass-panel rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl font-black text-secondary mb-2">{categories.length}</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Categories</div>
          </div>
          <div className="glass-panel rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl font-black text-accent mb-2">10+</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Topics</div>
          </div>
          <div className="glass-panel rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl font-black text-white mb-2">∞</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Potential</div>
          </div>
        </div>

        {/* Quiz CTA Section */}
        <div className="mb-16">
          <Link
            href="/quiz"
            className="block glass-panel rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-accent blur-[80px] rounded-full"></div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">🧪</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                  Test Your Knowledge
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Take interactive quizzes across {categories.length} categories. Answer 10 multiple-choice questions and get instant feedback with detailed explanations.
                </p>
              </div>
              <div className="glass-panel px-6 py-3 rounded-full font-semibold text-sm group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300 inline-flex items-center gap-2 shrink-0">
                Start Quiz
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Categories */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <Link
                  key={cat}
                  href={`/categories/${cat}`}
                  className="glass-panel px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 capitalize"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Questions */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-secondary rounded-full"></span>
              Latest Insights
            </h2>
            <div className="space-y-4">
              {latest.map(q => (
                <Link
                  key={q.slug}
                  href={`/questions/${q.slug}`}
                  className="block glass-panel p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {q.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                        <span className="bg-white/10 px-2 py-1 rounded uppercase tracking-wider">{q.category}</span>
                        {q.lastUpdated && (
                          <span className="flex items-center gap-1 opacity-70">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {new Date(q.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500 group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center md:text-left">
               <Link
                href="/questions"
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 font-medium"
              >
                Browse Entire Vault →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}