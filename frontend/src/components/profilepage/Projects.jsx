import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { useAuthStore } from '../../store/useAuthStore';
import capitalizeWords from '../../lib/capitalize.js';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [Index, setIndex] = useState();
    const [previewProject, setPreviewProject] = useState(null);
    const {authUser,deleteProject,addingProject,editProject} = useAuthStore();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        from: "",
        to: "",
        url: "",
    });

    useEffect(()=>{
        setProjects(authUser.experience);
    },[authUser])

    const handleInputChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleAddProject = async () => {
        await addingProject(formData);
        if(formData.title && formData.content){
            setProjects([...projects, formData]);
            setFormData({ title: "", content: "", from: "", to: "", url: "" });
            setShowForm(false);
        }
    };

    const handleDelete = async (index) => {
        setProjects(projects.filter((_, i) => i !== index));
        await deleteProject(index);
    };

    const handleEdit = (index)=>{
        const exp = projects[index];
        setFormData(exp);
        setUpdateForm(true);
        setIndex(index);
    }

    const handleUpdate = async ()=>{
        const index = Index;
        await editProject(index,formData);
        if(formData.title && formData.content) {setUpdateForm(false);setFormData({ title: "", content: "", from: "", to: "", url: "" });}
    }

    return (
      <div className="w-full min-h-screen bg-[#0d1117] p-8 font-mono text-white flex flex-col items-center">
        <div className="w-full max-w-6xl bg-[#161b22] rounded-xl p-8 border border-[#30363d] shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-[#2ea043]">Projects</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setFormData({
                  title: "",
                  content: "",
                  from: "",
                  to: "",
                  url: ""
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#238636] hover:bg-[#2ea043] rounded-lg transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="text-lg font-semibold">Add Project</span>
            </button>
          </div>
  
          {projects.length === 0 && (
            <div className="text-center text-zinc-400 italic py-20 text-xl select-none">
              You haven't added any projects yet.<br />
              <span className="text-sm text-zinc-500">Click "Add Project" to get started.</span>
            </div>
          )}
  
          {/* Project Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-[#0d1117] p-6 rounded-xl border border-[#30363d] hover:border-[#238636] transition-colors shadow-md cursor-pointer group flex flex-col justify-between"
                onClick={() => setPreviewProject(project)}
              >
                <div>
                  <h3 className="font-semibold text-xl truncate text-white mb-2">{capitalizeWords(project.title)}</h3>
                  <p
                    className="text-sm text-[#8b949e] overflow-hidden text-ellipsis leading-relaxed max-h-[5.4em]"
                  >
                    {project.content}
                  </p>
                  <p className="text-xs text-[#6e7681] mt-3">
                    {project?.from?.split("T")[0]} - {project.to?.split("T")[0]}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#238636] hover:text-[#2ea043] underline text-sm mt-2 inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Project
                    </a>
                  )}
                </div>
  
                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="p-2 bg-[#da3633] hover:bg-[#f85149] text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Add/Edit Project Form Modal */}
        {(showForm || updateForm) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="bg-[#161b22] p-8 rounded-2xl w-full max-w-xl border border-[#30363d] shadow-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-6 text-white">
                {updateForm ? "Update Project" : "Add New Project"}
              </h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm text-[#8b949e] mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#238636]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8b949e] mb-2">Description</label>
                  <textarea
                    name="content"
                    placeholder="Project Description"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#238636]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#8b949e] mb-2">From</label>
                    <input
                      type="date"
                      name="from"
                      value={formData.from}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#238636]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#8b949e] mb-2">To</label>
                    <input
                      type="date"
                      name="to"
                      value={formData.to}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#238636]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#8b949e] mb-2">Project URL</label>
                  <input
                    type="url"
                    name="url"
                    placeholder="Project URL"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#238636]"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setUpdateForm(false);
                      setFormData({
                        title: "",
                        content: "",
                        from: "",
                        to: "",
                        url: ""
                      });
                    }}
                    className="px-6 py-3 bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#1f2428] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      !updateForm ? handleAddProject() : handleUpdate();
                    }}
                    className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
                  >
                    {!updateForm ? "Add" : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Preview Modal */}
        {previewProject && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="relative bg-[#161b22] p-8 rounded-2xl w-full max-w-3xl border border-[#30363d] shadow-lg space-y-6 max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setPreviewProject(null)}
                className="absolute top-6 right-6 text-[#8b949e] hover:text-white transition-colors"
              >
                <X size={26} />
              </button>
  
              <h2 className="text-3xl font-bold text-white border-b border-[#30363d] pb-3">
                {capitalizeWords(previewProject.title)}
              </h2>
  
              <div className="space-y-4">
                <p className="text-base text-[#8b949e] whitespace-pre-wrap leading-relaxed">
                  {previewProject.content}
                </p>
  
                <p className="text-sm text-[#6e7681]">
                  {previewProject?.from?.split("T")[0]} - {previewProject.to?.split("T")[0]}
                </p>
  
                {previewProject.url && (
                  <a
                    href={previewProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#238636] hover:text-[#2ea043] underline text-base block"
                  >
                    🔗 Visit Project
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
      
}

export default Projects