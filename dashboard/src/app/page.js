"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ProjectList from "../components/ProjectList";
import ProjectConfig from "../components/ProjectConfig";
import { mockProjects, mockFragments } from "../components/mockData";

export default function Home() {
  const [projects, setProjects] = useState([]); // Start with no projects
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectContext, setNewProjectContext] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // "details" or "fragments"
  const [projectFragments, setProjectFragments] = useState([]); // Fragments for the selected project

  // State for adding a new fragment
  const [newFragmentSummary, setNewFragmentSummary] = useState("");
  const [newFragmentLink, setNewFragmentLink] = useState("");

  // Persistent counter for fragment IDs
  const fragmentIdCounter = useRef(0);

  useEffect(() => {
    // Simulate loading projects (empty on startup)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Your API fetch code can stay here
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/query_fragment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paragraph: "Some example paragraph to query",
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project);

    // Filter fragments for this project
    const fragments = mockFragments.filter((f) => f.projectId === projectId);
    setProjectFragments(fragments);

    // Reset to details tab when selecting a new project
    setActiveTab("details");
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectContext.trim()) {
      alert("Please enter both a project name and context.");
      return;
    }

    setIsLoading(true);
    try {
      // Create a new project
      const newProject = {
        id: `proj_${newProjectName.toLowerCase().replace(/\s+/g, "_")}`,
        name: newProjectName,
        template: "default",
        projects: "projects",
        context: newProjectContext,
        url: "https://example.com/new-project",
      };

      // Add the new project to the projects state
      setProjects([...projects, newProject]);

      // Associate all fragments from mock data with the new project
      const fragmentsForNewProject = mockFragments.map((fragment) => ({
        ...fragment,
        projectId: newProject.id, // Associate with the new project
      }));
      setProjectFragments(fragmentsForNewProject);

      // Select the newly created project
      setSelectedProject(newProject);

      // Clear the form fields
      setNewProjectName("");
      setNewProjectContext("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating project:", error);
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null); // Deselect if the deleted project was selected
      setProjectFragments([]); // Clear fragments
    }
  };

  const handleAddFragment = () => {
    if (!newFragmentSummary.trim() || !newFragmentLink.trim()) {
      alert("Please enter both a summary and a link for the fragment.");
      return;
    }

    const newFragment = {
      id: `frag_${fragmentIdCounter.current++}`, // Unique ID using the counter
      name: `Fragment ${projectFragments.length + 1}`,
      template: "default",
      context: newFragmentSummary,
      url: newFragmentLink,
      projectId: selectedProject.id, // Associate with the selected project
    };

    // Add the new fragment to the projectFragments state
    setProjectFragments([...projectFragments, newFragment]);

    // Clear the form fields
    setNewFragmentSummary("");
    setNewFragmentLink("");
  };

  const handleDeleteFragment = (fragmentId) => {
    const updatedFragments = projectFragments.filter((f) => f.id !== fragmentId);
    setProjectFragments(updatedFragments);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-12 bg-[#5880FA] text-white">
      {/* Logo and Header */}
      <header className="flex flex-col items-center gap-4 text-center py-8">
        <div className="relative group">
          <Image
            className="opacity-90 hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
            src="/logo.png"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-pink-500/30 via-indigo-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-wide sm:text-4xl bg-clip-text text-transparent bg-white drop-shadow-md">
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
              selectedProjectId={selectedProject?.id}
              onSelectProject={handleProjectSelect}
              onDeleteProject={handleDeleteProject}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full md:w-2/3">
            {selectedProject ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50">
                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                  <button
                    className={`px-6 py-3 font-medium ${
                      activeTab === "details"
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Paper Details
                  </button>
                  <button
                    className={`px-6 py-3 font-medium ${
                      activeTab === "fragments"
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setActiveTab("fragments")}
                  >
                    Fragments
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "details" ? (
                    <ProjectConfig
                      project={selectedProject}
                      onSave={(updatedProject) => {
                        const updatedProjects = projects.map((p) =>
                          p.id === updatedProject.id ? updatedProject : p
                        );
                        setProjects(updatedProjects);
                        setSelectedProject(updatedProject);
                      }}
                    />
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Fragments ({projectFragments.length})
                      </h2>

                      {/* Fragment List */}
                      {projectFragments.length === 0 ? (
                        <div className="text-slate-400 mb-6">No fragments available for this project.</div>
                      ) : (
                        <div className="space-y-4 mb-6">
                          {projectFragments.map((fragment) => (
                            <div
                              key={fragment.id} // Unique key for each fragment
                              className="p-4 bg-slate-700/50 rounded-lg"
                            >
                              <div className="flex justify-between">
                                <h3 className="font-medium">{fragment.name}</h3>
                                <span className="text-slate-400 text-sm">{fragment.template}</span>
                              </div>
                              <p className="text-sm text-slate-300 mt-1">
                                {fragment.context}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <a
                                  href={fragment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400"
                                >
                                  Go to Source
                                </a>
                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDeleteFragment(fragment.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Fragment Form */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Add New Fragment</h3>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddFragment();
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">Summary</label>
                            <textarea
                              placeholder="Enter fragment summary"
                              value={newFragmentSummary}
                              onChange={(e) => setNewFragmentSummary(e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              rows="3"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Link</label>
                            <input
                              type="url"
                              placeholder="Enter fragment link"
                              value={newFragmentLink}
                              onChange={(e) => setNewFragmentLink(e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-medium transition-colors"
                          >
                            Add Fragment
                          </button>
                        </form>
                      </div>


                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50">
                <h2 className="text-xl font-semibold mb-6 text-cyan-100">Select a project or create a new one</h2>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <h2>Name:</h2>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <h2>Summary: </h2>
                  <textarea
                    placeholder="Project Context"
                    value={newProjectContext}
                    onChange={(e) => setNewProjectContext(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                  >
                    Create New Project
                  </button>
                </form>
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