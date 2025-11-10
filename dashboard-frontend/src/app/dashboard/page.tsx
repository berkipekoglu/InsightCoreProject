"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createProject } from "../../lib/api";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  organization_id: number;
  created_at: string;
}

// Modal Component
const ScriptModal = ({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) => {
  if (!project) return null;

  const script = `<script async src="http://localhost:3000/sdk.js" data-project-id="${project.id}" data-collector-url="http://localhost:8000/collect"><\/script>`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">
          Installation Script for {project.name}
        </h2>
        <p className="text-gray-400 mb-4">
          Copy and paste this script into the `&lt;head&gt;` tag of your
          website.
        </p>
        <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
          <code>{script}</code>
        </pre>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigator.clipboard.writeText(script)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Copy to Clipboard
          </button>
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [scriptToCopy, setScriptToCopy] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("insight-token");
    if (!token) {
      router.push("/"); // Redirect to login
      return;
    }

            const fetchProjects = async () => {
                try {
                    const userProjects = await getProjects();
                    if (userProjects && userProjects.length > 0) {
                        setProjects(userProjects);
                    } else {
                        setShowOnboarding(true);
                    }
                } catch (err: any) {        setError(err.message || "Failed to fetch projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;

    try {
      const newProject = await createProject(newProjectName);
      const script = `<script async src="http://localhost:3000/sdk.js" data-project-id="${newProject.id}" data-collector-url="http://localhost:8000/collect"><\/script>`;
      setScriptToCopy(script);
      // Refresh projects list
      setProjects([newProject, ...projects]);
      setShowOnboarding(false); // Hide onboarding
      setSelectedProject(newProject); // Show modal for the new project
    } catch (err: any) {
      setError(err.message || "Failed to create project.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to InsightCore</h1>
          <p className="text-gray-400 mb-8">
            Create your first project to get started.
          </p>

          <form
            onSubmit={handleCreateProject}
            className="flex flex-col items-center gap-4"
          >
            <input
              type="text"
              placeholder="Your project's name (e.g., My Website)"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full max-w-md"
              required
            />
            <button type="submit" className="w-full max-w-md">
              Create Project
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <>
      <ScriptModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <main className="flex min-h-screen flex-col items-center p-12">
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Projects</h1>
            {/* Optional: Add a button to create new projects from here */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                href={`/dashboard/projects/${project.id}/sessions`}
                key={project.id}
              >
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                  <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                  <p className="text-sm text-gray-400">
                    Project ID: {project.id}
                  </p>
                </div>
              </Link>
            ))}{" "}
          </div>
        </div>
      </main>
    </>
  );
}
