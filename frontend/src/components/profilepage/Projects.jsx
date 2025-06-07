import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { useAuthStore } from '../../store/useAuthStore';

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
        if(formData.title && formData.content){
            setProjects([...projects, formData]);
            setFormData({ title: "", content: "", from: "", to: "", url: "" });
            setShowForm(false);
        }
        addingProject(formData);
    };

    const handleDelete = async (index) => {
        setProjects(projects.filter((_, i) => i !== index));
        deleteProject(index);
    };

    const handleEdit = (index)=>{
        const exp = projects[index];
        setFormData(exp);
        setUpdateForm(true);
        setIndex(index);
    }

    const handleUpdate = async ()=>{
        const index = Index;
        editProject(index,formData);
        if(formData.title && formData.content) {setUpdateForm(false);setFormData({ title: "", content: "", from: "", to: "", url: "" });}
    }
    
    return (
        <div className="max-w-3xl mx-auto bg-base-300 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-medium">Projects</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-sm bg-green-600 text-white hover:bg-green-700 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        
          {projects.length==0 && (<div className="text-center text-zinc-400 italic py-10">
            You haven't added any projects yet.
            <br />
            <span className="text-sm text-zinc-500">Click "Add Project" to get started.</span>
          </div>)}

      
          {/* Project Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-base-200 p-4 rounded-xl border border-zinc-700 space-y-2 relative group"
              >
                {/* Clickable area for preview */}
                <div
                  onClick={() => setPreviewProject(project)} // define this to show full preview
                  className="cursor-pointer overflow-hidden"
                >
                  <h3 className="font-semibold text-base truncate">{project.title}</h3>
                  <p
                    className="text-sm text-zinc-400 overflow-hidden text-ellipsis"
                    style={{ maxHeight: "3.6em" }} // roughly 3 lines of text
                  >
                    {project.content}
                  </p>
                  <p className="text-xs text-gray-400">
                    {project?.from?.split("T")[0]} - {project.to?.split("T")[0]}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline text-sm block"
                      onClick={(e) => e.stopPropagation()} // prevent preview trigger
                    >
                      Visit Project
                    </a>
                  )}
                </div>
      
                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="btn btn-xs bg-yellow-500 text-white hover:bg-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="btn btn-xs bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
      
          {/* Add Form Modal */}
          {(showForm || updateForm) && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-base-100 p-6 rounded-lg w-full max-w-md space-y-4 border border-zinc-700">
                <h3 className="text-lg font-medium">Add New Project</h3>
                <input
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
                <textarea
                  name="content"
                  placeholder="Project Description"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="from"
                    placeholder="From"
                    value={formData.from}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="date"
                    name="to"
                    placeholder="To"
                    value={formData.to}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <input
                  type="url"
                  name="url"
                  placeholder="Project URL"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setUpdateForm(false);
                    }}
                    className="btn btn-sm bg-zinc-600 text-white hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      !updateForm ? handleAddProject() : handleUpdate();
                    }}
                    className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                  >
                    {!updateForm ? "Add" : "Update"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Modal */}
            {previewProject && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                <div className="relative bg-gradient-to-br from-base-200 to-base-100 p-6 rounded-2xl w-full max-w-xl border border-zinc-600 shadow-xl space-y-4 overflow-y-auto max-h-[85vh] text-white">
                <button
                    onClick={() => setPreviewProject(null)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-white border-b border-zinc-600 pb-2">
                    {previewProject.title}
                </h2>

                <div className="space-y-2">
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap break-words leading-relaxed">
                    {previewProject.content}
                    </p>

                    <p className="text-xs text-zinc-500 mt-2 italic">
                    Duration:{" "}
                    <span className="text-zinc-300">
                        {previewProject.from?.split("T")[0]} - {previewProject.to?.split("T")[0]}
                    </span>
                    </p>

                    {previewProject.url && (
                    <a
                        href={previewProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm font-medium text-blue-400 underline hover:text-blue-300 transition"
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