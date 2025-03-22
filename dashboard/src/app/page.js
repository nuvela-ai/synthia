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
        setTimeout(() => {
          const mockProjects = [
            { id: 'proj_research_paper', name: 'Research Paper', template: 'research', fragments: 12 },
            { id: 'proj_web_app', name: 'Web Application', template: 'development', fragments: 8 },
            { id: 'proj_documentation', name: 'API Documentation', template: 'default', fragments: 5 },
          ];
          setProjects(mockProjects);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project);
  };

  const handleCreateProject = async (projectData) => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        const newProject = {
          id: `proj_${projectData.name.toLowerCase().replace(/\s+/g, '_')}`,
          name: projectData.name,
          template: projectData.template || 'default',
          fragments: 0
        };
        
        setProjects([...projects, newProject]);
        setSelectedProject(newProject);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error creating project:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Logo */}
      <header className="flex flex-col items-center gap-4 text-center py-8">
        <Image
          className="opacity-80 hover:opacity-100 transition-opacity duration-300"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-extrabold tracking-wide sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Synthia Dashboard
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">Project Management Dashboard</p>
      </header>

      {/* Main Content */}
      <main className="mt-10 w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <ProjectList 
              projects={projects} 
              selectedProjectId={selectedProject?.id}
              onSelectProject={handleProjectSelect}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full md:w-2/3">
            {selectedProject ? (
              <ProjectConfig 
                project={selectedProject}
                onSave={(updatedProject) => {
                  const updatedProjects = projects.map(p => 
                    p.id === updatedProject.id ? updatedProject : p
                  );
                  setProjects(updatedProjects);
                  setSelectedProject(updatedProject);
                }}
              />
            ) : (
              <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Select a project or create a new one</h2>
                <button 
                  className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all shadow-md"
                  onClick={() => {
                    const projectName = prompt('Enter project name:');
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
      <footer className="mt-10 py-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
        <p>Synthia Dashboard &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}