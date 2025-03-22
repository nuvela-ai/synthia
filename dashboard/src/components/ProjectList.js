import React from 'react';

function ProjectList({ projects, selectedProjectId, onSelectProject, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="text-gray-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      
      {projects.length === 0 ? (
        <div className="text-gray-400">No projects found</div>
      ) : (
        <ul className="space-y-2">
          {projects.map(project => (
            <li 
              key={project.id} 
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedProjectId === project.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => onSelectProject(project.id)}
            >
              <div className="font-semibold">{project.name}</div>
              <div className="text-sm text-gray-300">
                {project.template} · {project.fragments} fragments
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <button 
        className="mt-4 w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all"
        onClick={() => {
          const projectName = prompt('Enter project name:');
          if (projectName) {
            const newProject = {
              id: `proj_${projectName.toLowerCase().replace(/\s+/g, '_')}`,
              name: projectName,
              template: 'default',
              fragments: 0
            };
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