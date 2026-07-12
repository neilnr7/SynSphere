import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TaskForm from "@/components/forms/TaskForm";
import PageLoader from "@/components/common/PageLoader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import projectService from "@/services/projectService";
import taskService from "@/services/taskService";

const CreateTaskPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setPageLoading(true);
        setServerError("");

        const [projectData, memberData] = await Promise.all([
          projectService.getProjectById(projectId),
          projectService.getProjectMembers(projectId),
        ]);

        setProject(projectData);
        setMembers(memberData);
      } catch (err) {
        setServerError(
          err.response?.data?.message ||
            "Unable to load task creation page.",
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchPageData();
  }, [projectId]);

  const handleSubmit = async (taskData) => {
    try {
      setSubmitting(true);
      setServerError("");

      await taskService.createTask(projectId, taskData);

      navigate(`/projects/${projectId}`);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to create task.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  if (pageLoading) {
    return <PageLoader message="Loading task form..." />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="
          flex flex-wrap items-center gap-1
          text-sm text-text-muted
        "
      >
        <Link
          to="/projects"
          className="
            transition-colors
            hover:text-primary
          "
        >
          Projects
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          to={`/projects/${projectId}`}
          className="
            max-w-64 truncate
            transition-colors
            hover:text-primary
          "
        >
          {project?.name || "Project"}
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-text-secondary">
          New Task
        </span>
      </nav>

      <div>
        <h1
          className="
            text-2xl font-bold tracking-tight text-text
            sm:text-3xl
          "
        >
          Create Task
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Add a new task to {project?.name}.
        </p>
      </div>

      <Card padding={false}>
        <CardHeader className="border-b border-border px-6 py-5">
          <CardTitle>Task Details</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <TaskForm
            members={members}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
            serverError={serverError}
            submitLabel="Create Task"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTaskPage;