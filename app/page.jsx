// app/page.jsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
        Maze Quest
      </h1>
      <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl">
        Dare to navigate the labyrinth? Test your wit and agility in a challenging maze. Your journey awaits!
      </p>
      <Link
        href="/maze"
        className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
      >
        Enter the Maze
      </Link>
    </main>
  );
}
