import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-secondary">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Chat App</h1>
      <p className="text-lg mb-6">Connect and chat with others in real-time.</p>
      <Link
        href="/user"
        className="bg-secondary text-primary px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
      >
        Go to Chat
      </Link>
    </div>
  );
}
