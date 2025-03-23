import React, { useState } from 'react';

function ProjectConfig({ project, onSave }) {
  const [editedProject, setEditedProject] = useState({ ...project });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({
      ...editedProject,
      [name]: value
    });
  };

  const handleSave = () => {
    onSave(editedProject);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProject({ ...project });
    setIsEditing(false);
  };

  const renderDetailsTab = () => (
    <div className="space-y-4">
      {isEditing ? (
        <form className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-400">Project Name</label>
            <input
              type="text"
              name="name"
              value={editedProject.name}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full bg-gray-700 rounded-lg text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-400">Template</label>
            <select
              name="template"
              value={editedProject.template}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full bg-gray-700 rounded-lg text-white"
            >
              <option value="default">Default</option>
              <option value="research">Research</option>
              <option value="development">Development</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{project.name}</h2>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-400">
              <span className="font-medium">ID:</span> {project.id}
            </div>
            <div className="text-sm text-gray-400">
              <span className="font-medium">Template:</span> {project.template}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFragmentsTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Fragments ({project.fragments})</h3>
      
      {project.fragments > 0 ? (
        <div className="text-gray-400">
          <p>Fragment list would be displayed here in a real implementation.</p>
          <p>This would include options to view, edit, and manage fragments.</p>
        </div>
      ) : (
        <div className="text-gray-400">
          <p>No fragments available for this project.</p>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            Add Fragment
          </button>
        </div>
      )}
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Fragment Tools</h4>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
            Suggest Fragment
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
            Save Fragment
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
            Generate Citations
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'details'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Project Details
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'details' ? renderDetailsTab() : renderFragmentsTab()}
      </div>
    </div>
  );
}

export default ProjectConfig;