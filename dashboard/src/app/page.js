"use client";
import katex from "katex";
import "katex/dist/katex.min.css";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ProjectList from "../components/ProjectList";
import ProjectConfig from "../components/ProjectConfig";
import { mockProjects, mockFragments } from "../components/mockData";
//import { LatexEditor } from '../utils/pdf';

export default function Home() {
  const [projects, setProjects] = useState(mockProjects); // Initialize with mock projects
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
  const [newFragmentTitle, setNewFragmentTitle] = useState("");
  const [newFragmentSummary, setNewFragmentSummary] = useState("");
  const [newFragmentLink, setNewFragmentLink] = useState("");
  const [newFragmentYear, setNewFragmentYear] = useState("");
  const [newFragmentAuthor, setNewFragmentAuthor] = useState("");
  const [previewMode, setPreviewMode] = useState("latex"); // Added to toggle between LaTeX and PDF preview
  const fragmentIdCounter = useRef(0);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const LatexEditor = ({ content, onContentChange, onClose }) => {
    const previewRef = useRef(null);
    const pdfPreviewRef = useRef(null);
    
    // Function to render specific LaTeX elements
    const renderLatexPreview = (content) => {
      if (!previewRef.current) return;
      
      try {
        // Clear the preview container
        previewRef.current.innerHTML = "";
        
        // Create a container for the rendered content
        const container = document.createElement('div');
        container.className = 'latex-preview-container text-white';
        
        // Extract title if present
        const titleMatch = content.match(/\\title{\\textbf{(.*?)}}/);
        if (titleMatch && titleMatch[1]) {
          const titleElem = document.createElement('h1');
          titleElem.className = 'text-xl font-bold text-center mb-4';
          titleElem.textContent = titleMatch[1];
          container.appendChild(titleElem);
        }
        
        // Extract abstract if present
        const abstractMatch = content.match(/\\begin{abstract}([\s\S]*?)\\end{abstract}/);
        if (abstractMatch && abstractMatch[1]) {
          const abstractSection = document.createElement('div');
          abstractSection.className = 'mb-4';
          
          const abstractTitle = document.createElement('h2');
          abstractTitle.className = 'text-lg font-semibold mb-2';
          abstractTitle.textContent = 'Abstract';
          abstractSection.appendChild(abstractTitle);
          
          const abstractText = document.createElement('p');
          abstractText.className = 'text-sm mb-4 italic';
          abstractText.textContent = abstractMatch[1].replace(/\\noindent\s+/g, '').trim();
          abstractSection.appendChild(abstractText);
          
          container.appendChild(abstractSection);
        }
        
        // Extract sections
        const sectionMatches = content.matchAll(/\\section\*{(.*?)}([\s\S]*?)(?=\\section\*{|\\end{document})/g);
        for (const match of sectionMatches) {
          const sectionTitle = match[1];
          const sectionContent = match[2].trim();
          
          const sectionElement = document.createElement('div');
          sectionElement.className = 'mb-6';
          
          const sectionTitleElem = document.createElement('h2');
          sectionTitleElem.className = 'text-lg font-semibold mb-2';
          sectionTitleElem.textContent = sectionTitle;
          sectionElement.appendChild(sectionTitleElem);
          
          // Check for subsections
          if (sectionContent.includes('\\subsection*{')) {
            const subsectionMatches = sectionContent.matchAll(/\\subsection\*{(.*?)}([\s\S]*?)(?=\\subsection\*{|$)/g);
            for (const subMatch of subsectionMatches) {
              const subsectionTitle = subMatch[1];
              const subsectionContent = subMatch[2].trim();
              
              const subsectionElement = document.createElement('div');
              subsectionElement.className = 'ml-4 mb-3';
              
              const subsectionTitleElem = document.createElement('h3');
              subsectionTitleElem.className = 'text-md font-semibold mb-2';
              subsectionTitleElem.textContent = subsectionTitle;
              subsectionElement.appendChild(subsectionTitleElem);
              
              const subsectionText = document.createElement('p');
              subsectionText.className = 'text-sm mb-2';
              subsectionText.textContent = subsectionContent.replace(/\\textbf{Source:} \\url{.*?}/g, '').trim();
              subsectionElement.appendChild(subsectionText);
              
              sectionElement.appendChild(subsectionElement);
            }
          } else if (sectionContent.includes('\\begin{itemize}')) {
            // Handle itemized lists
            const listMatch = sectionContent.match(/\\begin{itemize}([\s\S]*?)\\end{itemize}/);
            if (listMatch && listMatch[1]) {
              const listItems = listMatch[1].split('\\item').filter(item => item.trim() !== '');
              
              const ulElement = document.createElement('ul');
              ulElement.className = 'list-disc ml-6 mb-4';
              
              listItems.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.className = 'mb-2';
                itemElement.textContent = item.replace(/\\textbf{(.*?)}:/g, '$1:').trim();
                ulElement.appendChild(itemElement);
              });
              
              sectionElement.appendChild(ulElement);
            } else {
              // Regular paragraph
              const sectionText = document.createElement('p');
              sectionText.className = 'text-sm';
              sectionText.textContent = sectionContent;
              sectionElement.appendChild(sectionText);
            }
          } else {
            // Regular paragraph
            const sectionText = document.createElement('p');
            sectionText.className = 'text-sm';
            sectionText.textContent = sectionContent;
            sectionElement.appendChild(sectionText);
          }
          
          container.appendChild(sectionElement);
        }
        
        // Append the entire container to the preview element
        previewRef.current.appendChild(container);
      } catch (error) {
        console.error("LaTeX rendering error:", error);
        previewRef.current.innerHTML = "<div class='text-red-500 p-2'>Error rendering LaTeX. Please check your syntax.</div>";
      }
    };
    
    // PDF preview generation
    useEffect(() => {
      if (previewMode === "latex" && previewRef.current) {
        renderLatexPreview(content);
      } else if (pdfPreviewRef.current && previewMode === "pdf") {
        generatePdfPreview(content, pdfPreviewRef.current);
      }
    }, [content, previewMode]);
    
    // Function to generate a PDF preview from LaTeX content
    const generatePdfPreview = (latexContent, containerElement) => {
      // Display a loading message while "generating" the PDF
      containerElement.innerHTML = '<div class="text-center p-4">Generating PDF preview...</div>';
      
      // Extract project title
      const titleMatch = latexContent.match(/\\title{\\textbf{(.*?)}}/);
      const projectTitle = titleMatch ? titleMatch[1] : 'Document Title';
      
      // Extract abstract content
      const abstractMatch = latexContent.match(/\\begin{abstract}([\s\S]*?)\\end{abstract}/);
      const abstractContent = abstractMatch ? 
        abstractMatch[1].replace(/\\noindent\s+/g, '').trim() : 
        'Abstract content will appear here';
      
      // Simulate PDF generation with a timeout
      setTimeout(() => {
        // Create a styled preview that mimics a PDF document
        containerElement.innerHTML = `
          <div class="bg-white text-black p-6 rounded shadow-md mx-auto max-w-full" style="min-height: 200px; max-height: 100%; overflow-y: auto;">
            <div class="text-center mb-6">
              <h1 class="text-xl font-bold">${projectTitle}</h1>
              <p class="text-sm mt-2">Author Name</p>
              <p class="text-sm text-gray-500">${new Date().toLocaleDateString()}</p>
            </div>
            <div class="mb-4">
              <h2 class="text-lg font-semibold mb-2">Abstract</h2>
              <p class="text-sm">${abstractContent}</p>
            </div>
            <div>
              <h2 class="text-lg font-semibold mb-2">Content</h2>
              <p class="text-sm">This document includes sections on:</p>
              <ul class="list-disc ml-6 text-sm">
                ${latexContent.match(/\\section\*{(.*?)}/g)?.map(section => 
                  `<li>${section.replace('\\section*{', '').replace('}', '')}</li>`
                ).join('') || '<li>Introduction</li>'}
              </ul>
              <p class="text-sm mt-4">Your document contains ${latexContent.length} characters and approximately ${Math.ceil(latexContent.length/2000)} pages.</p>
            </div>
            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500">Generated by Synthia Dashboard</p>
              <p class="text-xs text-gray-500">Page 1</p>
            </div>
          </div>
        `;
      }, 500);
    };
  
    const handleExportPdf = () => {
      // In a real application, this would trigger the actual PDF generation and download
      alert("In a production environment, this would generate and download a real PDF file from your LaTeX content.");
      
      // Simulating download with a fake download prompt
      const downloadLink = document.createElement('a');
      downloadLink.href = '#';
      downloadLink.download = `${titleMatch ? titleMatch[1] : 'document'}.pdf`;
      downloadLink.onclick = (e) => {
        e.preventDefault();
        alert("PDF generation service would be called here. This is just a demonstration.");
      };
      downloadLink.click();
    };
  
    // Extract project title for file naming
    const titleMatch = content.match(/\\title{\\textbf{(.*?)}}/);
  
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
          
          {/* Preview mode toggle buttons */}
          <div className="mb-4 flex space-x-2">
            <button 
              onClick={() => setPreviewMode("latex")}
              className={`px-3 py-1 rounded ${
                previewMode === "latex" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              LaTeX Preview
            </button>
            <button 
              onClick={() => setPreviewMode("pdf")}
              className={`px-3 py-1 rounded ${
                previewMode === "pdf" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              PDF Preview
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
            
            {/* Preview Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">
                  {previewMode === "latex" ? "LaTeX Preview" : "PDF Preview"}
                </h3>
                {previewMode === "pdf" && (
                  <button
                    onClick={handleExportPdf}
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded text-white"
                  >
                    Export PDF
                  </button>
                )}
              </div>
              
              {/* LaTeX Preview Container */}
              <div
                ref={previewRef}
                className={`h-64 p-3 rounded-lg bg-slate-700/50 overflow-y-auto ${
                  previewMode === "latex" ? "block" : "hidden"
                }`}
              />
              
              {/* PDF Preview Container */}
              <div
                ref={pdfPreviewRef}
                className={`h-64 p-3 rounded-lg bg-slate-700/50 overflow-y-auto ${
                  previewMode === "pdf" ? "block" : "hidden"
                }`}
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
    if (!newFragmentTitle.trim() || !newFragmentSummary.trim() || !newFragmentLink.trim()) {
      alert("Please enter a title, summary, and link for the fragment.");
      return;
    }
  
    const newFragment = {
      id: `frag_${fragmentIdCounter.current++}`, // Unique ID using the counter
      name: newFragmentTitle, // Use the custom title
      template: "default",
      context: newFragmentSummary,
      url: newFragmentLink,
      author: newFragmentAuthor, // Include the author
      year: newFragmentYear,
      projectId: selectedProject.id, // Associate with the selected project
    };
  
    // Add the new fragment to the projectFragments state
    setProjectFragments([...projectFragments, newFragment]);
  
    // Clear the form fields
    setNewFragmentTitle("");
    setNewFragmentSummary("");
    setNewFragmentLink("");
    setNewFragmentAuthor("");
    setNewFragmentYear("");
  };

  const handleDeleteFragment = (fragmentId) => {
    const updatedFragments = projectFragments.filter((f) => f.id !== fragmentId);
    setProjectFragments(updatedFragments);
  };

  const generateCitations = (fragments) => {
    return fragments.map((fragment, index) => ({
      id: `cite_${index + 1}`,
      text: `${fragment.author}. (${fragment.year}). "${fragment.name}." Retrieved from ${fragment.url}`,
    }));
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
                          {/* Title Input */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              placeholder="Enter fragment title"
                              value={newFragmentTitle}
                              onChange={(e) => setNewFragmentTitle(e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          </div>
                          {/* Author Input */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Author</label>
                            <input
                              type="text"
                              placeholder="Enter fragment author"
                              value={newFragmentAuthor}
                              onChange={(e) => setNewFragmentAuthor(e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          {/* Year Input */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <input
                              type="text"
                              placeholder="Enter fragment year"
                              value={newFragmentYear}
                              onChange={(e) => setNewFragmentYear(e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          {/* Summary Input */}
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
                          {/* Link Input */}
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
    const latex = `
\\documentclass[12pt]{article}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{url} % For formatting URLs
\\usepackage{hyperref} % For clickable links
\\usepackage{fancyhdr} % For headers and footers
\\usepackage{setspace} % For line spacing
\\usepackage{indentfirst} % Indent the first paragraph
\\usepackage{graphicx} % For including images
\\usepackage{amsmath} % For math equations
\\usepackage{biblatex} % For bibliography
\\addbibresource{references.bib} % Add your .bib file here

% Header and footer setup
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\leftmark}
\\fancyhead[R]{\\thepage}
\\fancyfoot[C]{Generated by Synthia Dashboard}

% Title and author
\\title{\\textbf{${selectedProject.name}}}
\\author{Author Name} % Replace with dynamic data if needed
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
\\noindent
${selectedProject.context}
\\end{abstract}

\\vspace{1cm}

\\section*{Introduction}
This paper explores the topic of \\textbf{${selectedProject.name}}. The following sections provide a detailed analysis based on the collected fragments. The goal is to understand the challenges and opportunities in this field, as well as to provide actionable insights for future research.

\\section*{Literature Review}
The following fragments provide a comprehensive overview of the current state of research on \\textbf{${selectedProject.name}}:

${projectFragments
  .map(
    (fragment, index) =>
      `\\subsection*{${fragment.name}}\n${fragment.context}\n\\textbf{Source:} \\url{${fragment.url}}\n`
  )
  .join("\n\n")}

\\section*{Methodology}
This section outlines the methodology used to analyze the collected fragments. The approach involves qualitative analysis of the sources, with a focus on identifying key themes and patterns.

\\section*{Results and Discussion}
The analysis of the fragments reveals several key insights:

\\begin{itemize}
${projectFragments
  .map(
    (fragment) =>
      `\\item \\textbf{${fragment.name}}: ${fragment.context}`
  )
  .join("\n")}
\\end{itemize}

\\section*{Conclusion}
In conclusion, the analysis of \\textbf{${selectedProject.name}} highlights the importance of addressing unanswerable questions and mitigating hallucination in large language models. The findings suggest that further research is needed to develop more robust frameworks for handling these challenges.

\\section*{References}
\\
${projectFragments
  .map(
    (fragment, index) =>
      `\\fragment${index + 1} ${fragment.author ? fragment.author : "Author Unknown"}. (${fragment.year ? fragment.year : "n.d."}). {${fragment.name}}. Retrieved from ${fragment.url}
    \\`
  )
  .join("\n")}

\\end{document}
`;
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
                            {generateCitations(projectFragments).map((citation) => (
                              <div key={citation.id} className="p-4 bg-slate-700/50 rounded-lg">
                                <p className="text-sm text-slate-300">
                                  <strong>Citation {citation.id.replace('cite_', '')}:</strong> {citation.text}
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