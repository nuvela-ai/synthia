"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ProjectList from "../components/ProjectList";
import ProjectConfig from "../components/ProjectConfig";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/project-init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_name: "Research Paper",
            template: "research",
          }),
        });
        const data = await response.json();
        setProjects([data]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (projectId) => {
    const project = projects.find((p) => p.project_id === projectId);
    setSelectedProject(project);
  };

  const handleCreateProject = async (projectData) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/project-init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectData.name,
          template: projectData.template || "default",
        }),
      });
      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating project:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white">
      {/* Logo */}
      <header className="flex flex-col items-center gap-4 text-center py-8">
        <div className="relative group">
          <Image
            className="opacity-90 hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-wide sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 drop-shadow-md">
          Synthia Dashboard
        </h1>
        <p className="text-slate-300 text-sm sm:text-base italic">Project Management Dashboard</p>
      </header>

      {/* Main Content */}
      <main className="mt-10 w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <ProjectList
              projects={projects}
              selectedProjectId={selectedProject?.project_id}
              onSelectProject={handleProjectSelect}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full md:w-2/3">
            {selectedProject ? (
              <ProjectConfig
                project={selectedProject}
                onSave={(updatedProject) => {
                  const updatedProjects = projects.map((p) =>
                    p.project_id === updatedProject.project_id ? updatedProject : p
                  );
                  setProjects(updatedProjects);
                  setSelectedProject(updatedProject);
                }}
              />
            ) : (
              <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50">
                <h2 className="text-xl font-semibold mb-6 text-cyan-100">Select a project or create a new one</h2>
                <button
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                  onClick={() => {
                    const projectName = prompt("Enter project name:");
                    if (projectName) {
                      handleCreateProject({ name: projectName });
                    }
                  }}
                >
                  Create New Project
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 py-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
        <p>Synthia Dashboard &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}