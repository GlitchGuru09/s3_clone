import NavBar from "../components/nav";
import ObjectsClient from "@/components/ui/ObjectsClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavBar />
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">File Explorer</h2>
        </div>
        <div>
          <ObjectsClient />
        </div>
      </main>
    </div>
  );
}
