import { Link } from "react-router-dom";

export default function TestPage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-black gap-8">
      <h1 className="text-4xl font-bold">🚀 Welcome to the Test Page!</h1>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition">
        Back to Main Page
      </Link>
    </div>
  );
}
