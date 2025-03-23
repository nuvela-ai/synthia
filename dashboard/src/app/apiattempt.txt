"use client";
import katex from "katex";
import "katex/dist/katex.min.css";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ProjectList from "../components/ProjectList";
import ProjectConfig from "../components/ProjectConfig";
import { mockProjects, mockFragments } from "../components/mockData";
import { mcpApi } from '../utils/api';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectContext, setNewProjectContext] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [projectFragments, setProjectFragments] = useState([]);
  const [showCitations, setShowCitations] = useState(false);
  const [showLatexEditor, setShowLatexEditor] = useState(false);
  const [latexContent, setLatexContent] = useState("");
  const [showSourceAnalysis, setShowSourceAnalysis] = useState(false);
  const [newFragmentSummary, setNewFragmentSummary] = useState("");
  const [newFragmentLink, setNewFragmentLink] = useState("");
  const fragmentIdCounter = useRef(0);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/QueryFragment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: "Some example paragraph to query",  // Ensure this matches the Pydantic model
          }),
        });
    
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  }, []);

  const LatexEditor = ({ content, onContentChange, onClose }) => {
    const previewRef = useRef(null);
  
    useEffect(() => {
      if (previewRef.current) {
        try {
          // Render the LaTeX content using KaTeX
          katex.render(content, previewRef.current, {
            throwOnError: false, // Don't throw errors for invalid LaTeX
          });
        } catch (error) {
          console.error("KaTeX rendering error:", error);
          previewRef.current.innerHTML = content; // Fallback to plain text if rendering fails
        }
      }
    }, [content]);
  
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-slate-800/90 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">LaTeX Editor</h2>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-100"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* LaTeX Editor */}
            <div>
              <h3 className="text-lg font-medium mb-2">Editor</h3>
              <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-64 p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your LaTeX content here..."
              />
            </div>
            {/* LaTeX Preview */}
            <div>
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <div
                ref={previewRef}
                className="h-64 p-3 rounded-lg bg-slate-700/50 text-white overflow-y-auto"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SourceAnalysisModal = ({ fragments, onClose }) => {
    // Generate random percentages for each fragment
    const sourceAnalysisData = fragments.map((fragment) => ({
      fragmentId: fragment.id,
      semanticMatch: `This fragment discusses ${fragment.name.toLowerCase()}.`, // Example semantic match
      matchPercentage: Math.floor(Math.random() * (100 - 70 + 1)) + 70, // Random percentage between 70 and 100
    }));
  
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-slate-800/90 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Source Analysis</h2>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-100"
            >
              ✕
            </button>
          </div>
          {/* Scrollable container */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {fragments.map((fragment) => {
                const analysis = sourceAnalysisData.find((data) => data.fragmentId === fragment.id);
                return (
                  <div key={fragment.id} className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-medium">{fragment.name}</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      {analysis ? analysis.semanticMatch : "No analysis available."}
                    </p>
                    {analysis && (
                      <div className="mt-2">
                        <span className="text-sm text-slate-400">
                          Match Confidence:{" "}
                          <span className="font-semibold text-green-400">
                            {analysis.matchPercentage}%
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      const result = await mcpApi.uploadFragment("testing a new paragraph");
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
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
                            fetchProjects();
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

                      {/* Generate Citations, Generate Paper, and Source Analysis Buttons */}
                      {projectFragments.length > 0 && (
                        <div className="flex gap-4 mb-6">
                          <button
                            onClick={() => setShowCitations(true)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-medium transition-colors"
                          >
                            Generate Citations
                          </button>
                          <button
                            onClick={() => {
                              const latex = projectFragments
                                .map(
                                  (fragment, index) =>
                                    `\\section*{${fragment.name}}\n${fragment.context}\n\\textbf{Source:} \\url{${fragment.url}}\n`
                                )
                                .join("\n");
                              setLatexContent(latex);
                              setShowLatexEditor(true);
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-medium transition-colors"
                          >
                            Generate Paper
                          </button>
                          <button
                            onClick={() => setShowSourceAnalysis(true)}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded text-white font-medium transition-colors"
                          >
                            Source Analysis
                          </button>
                        </div>
                      )}

                      {/* Citations Section */}
                      {showCitations && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">Generated Citations</h3>
                          <div className="space-y-4">
                            {projectFragments.map((fragment, index) => (
                              <div key={fragment.id} className="p-4 bg-slate-700/50 rounded-lg">
                                <p className="text-sm text-slate-300">
                                  <strong>Citation {index + 1}:</strong> {fragment.name} - {fragment.context} (
                                  <a
                                    href={fragment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-500"
                                  >
                                    Source
                                  </a>
                                  )
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

      {/* LaTeX Editor Modal */}
      {showLatexEditor && (
        <LatexEditor
          content={latexContent}
          onContentChange={setLatexContent}
          onClose={() => setShowLatexEditor(false)}
        />
      )}

      {/* Source Analysis Modal */}
      {showSourceAnalysis && (
        <SourceAnalysisModal
          fragments={projectFragments}
          onClose={() => setShowSourceAnalysis(false)}
        />
      )}
    </div>
  );
}