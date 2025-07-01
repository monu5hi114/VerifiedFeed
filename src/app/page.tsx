import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center sm:text-left">
        <Image
          src="/logo.png" // Replace with your logo or remove if not needed
          alt="VerifiedFeed logo"
          width={80}
          height={80}
          priority
        />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-600">✅ VerifiedFeed</h1>
          <p className="text-gray-600 mt-2 max-w-xl">
            A trusted community platform where people can submit, verify, and debunk online content collaboratively.
          </p>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link
            href="/submit"
            className="rounded-md bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition"
          >
            Submit a Post
          </Link>
          <Link
            href="/feed"
            className="rounded-md border border-blue-600 text-blue-600 px-6 py-3 hover:bg-blue-50 transition"
          >
            Explore Feed
          </Link>
        </div>
      </main>

      <footer className="row-start-3 text-sm text-gray-400 text-center">
        Built with ❤️ using Next.js + TailwindCSS
      </footer>
    </div>
  );
}
