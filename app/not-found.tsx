import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl pointer-events-none">
        <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glitchy 404 number */}
        <div className="relative mb-6">
          <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-gradient select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-primary/10 blur-[6px] select-none" aria-hidden="true">
            404
          </div>
        </div>

        {/* Divider line */}
        <div className="w-24 h-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-8"></div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
          Looks like this page got lost in the vault. The content you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="glass-panel px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 inline-flex items-center gap-2 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back Home
          </Link>

          <Link
            href="/questions"
            className="glass-panel px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2 group"
          >
            Browse Questions
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
