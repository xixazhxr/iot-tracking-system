import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import PageTransition from "../components/PageTransition";
import { Plus } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = () => {
    api.get("/projects").then(res => setProjects(res.data.projects));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <PageTransition>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-500 mt-1">Manage all your IoT projects</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No projects found. Create your first one!</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-primary font-medium hover:underline"
            >
              Create Project
            </button>
          </div>
        )}

        {showModal && (
          <ProjectModal
            onClose={() => setShowModal(false)}
            onSave={fetchProjects}
          />
        )}
      </div>
    </PageTransition>
  );
}
