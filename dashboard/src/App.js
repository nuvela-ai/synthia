import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectConfig from './components/ProjectConfig';
import './assets/styles/App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching projects from the MCP server
    const fetchProjects = async () => {
      try {
        // In a real implementation, this would communicate with the MCP server
        // For now, we'll use mock data
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
      // In a real implementation, this would call the MCP server's project-init tool
      // For now, we'll simulate the response
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
    <div className="app-container">
      <header className="app-header">
        <h1>Synthia</h1>
        <p>Project Management Dashboard</p>
      </header>
      
      <main className="app-main">
        <div className="app-sidebar">
          <ProjectList 
            projects={projects} 
            selectedProjectId={selectedProject?.id}
            onSelectProject={handleProjectSelect}
            isLoading={isLoading}
          />
        </div>
        
        <div className="app-content">
          {selectedProject ? (
            <ProjectConfig 
              project={selectedProject}
              onSave={(updatedProject) => {
                // Handle project updates
                const updatedProjects = projects.map(p => 
                  p.id === updatedProject.id ? updatedProject : p
                );
                setProjects(updatedProjects);
                setSelectedProject(updatedProject);
              }}
            />
          ) : (
            <div className="project-placeholder">
              <h2>Select a project or create a new one</h2>
              <button 
                className="create-project-btn"
                onClick={() => {
                  // Show project creation form
                  // In a real app, this would open a modal or navigate to a form
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
      </main>
      
      <footer className="app-footer">
        <p>Synthia Dashboard &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
