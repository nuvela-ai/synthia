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
    <div className="project-details">
      {isEditing ? (
        <form className="project-edit-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedProject.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="template">Template</label>
            <select
              id="template"
              name="template"
              value={editedProject.template}
              onChange={handleInputChange}
            >
              <option value="default">Default</option>
              <option value="research">Research</option>
              <option value="development">Development</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-save" onClick={handleSave}>
              Save Changes
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="project-info">
          <div className="project-header">
            <h2>{project.name}</h2>
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </div>
          
          <div className="project-meta">
            <div className="meta-item">
              <span className="meta-label">ID:</span>
              <span className="meta-value">{project.id}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Template:</span>
              <span className="meta-value">{project.template}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Fragments:</span>
              <span className="meta-value">{project.fragments}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFragmentsTab = () => (
    <div className="project-fragments">
      <h3>Fragments ({project.fragments})</h3>
      
      {project.fragments > 0 ? (
        <div className="fragments-list">
          <p>Fragment list would be displayed here in a real implementation.</p>
          <p>This would include options to view, edit, and manage fragments.</p>
        </div>
      ) : (
        <div className="empty-fragments">
          <p>No fragments available for this project.</p>
          <button className="btn-add-fragment">
            Add Fragment
          </button>
        </div>
      )}
      
      <div className="fragment-tools">
        <h4>Fragment Tools</h4>
        <div className="tool-buttons">
          <button className="tool-button" title="Suggest Fragment">
            Suggest Fragment
          </button>
          <button className="tool-button" title="Save Fragment">
            Save Fragment
          </button>
          <button className="tool-button" title="Generate Citations">
            Generate Citations
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="project-config">
      <div className="config-tabs">
        <button 
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Project Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'fragments' ? 'active' : ''}`}
          onClick={() => setActiveTab('fragments')}
        >
          Fragments
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'details' ? renderDetailsTab() : renderFragmentsTab()}
      </div>
    </div>
  );
}

export default ProjectConfig;
