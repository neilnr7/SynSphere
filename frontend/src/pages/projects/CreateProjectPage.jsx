import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "@/components/forms/ProjectForm";
import projectService from "@/services/projectService";

const CreateProjectPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleCreateProject = async (projectData) => {
    try {
      setLoading(true);
      setServerError("");

      await projectService.createProject(projectData);

      navigate("/projects");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to create project. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-text-muted">
          Projects / New Project
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Create Project
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Create a new project and start organizing your team's work.
        </p>
      </div>

      <div
        className="
          rounded-card
          border border-border
          bg-surface
          p-5
          shadow-sm
          sm:p-6
          lg:p-8
        "
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={handleCancel}
          loading={loading}
          serverError={serverError}
          submitLabel="Create Project"
        />
      </div>
    </div>
  );
};

export default CreateProjectPage;