import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Android Vault
        </Link>

        <nav className="flex gap-4 text-sm">
          <Link href="/" className="underline">
            Home
          </Link>
          <Link href="/questions" className="underline">
            Questions
          </Link>
        </nav>
      </div>
    </header>
  );
}