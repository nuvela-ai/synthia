ProjectList.js
import React from 'react';

function ProjectList({ projects, selectedProjectId, onSelectProject, onDeleteProject, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="text-gray-400">Loading Projects...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      
      {projects.length === 0 ? (
        <div className="text-gray-400">No Projects found</div>
      ) : (
        <ul className="space-y-4">
          {projects.map(project => (
            <li 
              key={project.id} 
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedProjectId === project.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1"
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className="font-semibold">{project.name}</div>
                  <div className="text-sm opacity-80">
                    {project.template} · {project.projects}
                  </div>
                  <div className="text-sm mt-2">
                    {project.context}
                  </div>
                  <div className="text-sm text-blue-300 mt-1">
                    View Details
                  </div>
                </div>
                <button
                  className="p-2 text-red-500 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    onDeleteProject(project.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectList;

// Finally, let's update the Home component: