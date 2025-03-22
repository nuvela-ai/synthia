import React from 'react';

function ProjectList({ projects, selectedProjectId, onSelectProject, isLoading }) {
  if (isLoading) {
    return (
      <div className="project-list-container">
        <h2>Projects</h2>
        <div className="loading-indicator">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="project-list-container">
      <h2>Projects</h2>
      
      {projects.length === 0 ? (
        <div className="empty-state">No projects found</div>
      ) : (
        <ul className="project-list">
          {projects.map(project => (
            <li 
              key={project.id} 
              className={`project-list-item ${selectedProjectId === project.id ? 'selected' : ''}`}
              onClick={() => onSelectProject(project.id)}
            >
              <div className="project-list-item-name">{project.name}</div>
              <div className="project-list-item-meta">
                <span className="project-template">{project.template}</span>
                <span className="project-fragments">{project.fragments} fragments</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <button 
        className="new-project-button"
        onClick={() => {
          // In a real app, this would open a modal or navigate to a form
          const projectName = prompt('Enter project name:');
          if (projectName) {
            // Create a new project with default template
            const newProject = {
              id: `proj_${projectName.toLowerCase().replace(/\s+/g, '_')}`,
              name: projectName,
              template: 'default',
              fragments: 0
            };
            // This is a simplified approach - in a real app we'd call the MCP server
            onSelectProject(newProject.id);
          }
        }}
      >
        + New Project
      </button>
    </div>
  );
}

export default ProjectList;
