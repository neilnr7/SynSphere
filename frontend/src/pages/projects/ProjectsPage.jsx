import { useEffect, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import ProjectCard from "@/components/cards/ProjectCard";
import Button from "@/components/ui/Button";
import projectService from "@/services/projectService";

const ProjectsPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await projectService.getProjects();

        setProjects(response);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load projects. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleCreateProject = () => {
    navigate("/projects/new");
  };

  const handleEditProject = (project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  if (loading) {
    return <PageLoader message="Loading projects..." />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div
        className="
          mb-8
          flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Projects
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Manage and collaborate across your projects.
          </p>
        </div>

        <Button
          leftIcon={Plus}
          onClick={handleCreateProject}
        >
          New Project
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="
            mb-6
            rounded-card
            border border-danger/20
            bg-danger/5
            px-4 py-3
            text-sm text-danger
          "
        >
          {error}
        </div>
      )}

      {!error && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project and start collaborating with your team."
          action={
            <Button
              leftIcon={Plus}
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          }
        />
      )}

      {!error && projects.length > 0 && (
        <div
          className="
            grid grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;