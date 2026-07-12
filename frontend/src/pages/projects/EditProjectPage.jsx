import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLoader from "@/components/common/PageLoader";
import ProjectForm from "@/components/forms/ProjectForm";
import projectService from "@/services/projectService";

const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setServerError("");

        const response =
          await projectService.getProjectById(projectId);

        setProject(response);
      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Unable to load project. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleUpdateProject = async (projectData) => {
    try {
      setSaving(true);
      setServerError("");

      await projectService.updateProject(
        projectId,
        projectData,
      );

      navigate("/projects");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to update project. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  if (loading) {
    return <PageLoader message="Loading project..." />;
  }

  if (!project) {
    return (
      <div
        role="alert"
        className="
          rounded-card
          border border-danger/20
          bg-danger/5
          px-4 py-3
          text-sm text-danger
        "
      >
        {serverError || "Project could not be loaded."}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-text-muted">
          Projects / Edit Project
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Edit Project
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Update project information and details.
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
          defaultValues={project}
          onSubmit={handleUpdateProject}
          onCancel={handleCancel}
          loading={saving}
          serverError={serverError}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditProjectPage;