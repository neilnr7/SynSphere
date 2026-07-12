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

const EditTaskPage = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [task, setTask] = useState(null);
  const [members, setMembers] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setPageLoading(true);
        setServerError("");

        const [projectData, taskData, memberData] =
          await Promise.all([
            projectService.getProjectById(projectId),
            taskService.getTaskById(projectId, taskId),
            projectService.getProjectMembers(projectId),
          ]);

        setProject(projectData);
        setTask(taskData);
        setMembers(memberData);
      } catch (err) {
        setServerError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to load task.",
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchPageData();
  }, [projectId, taskId]);

  const handleSubmit = async (taskData) => {
    try {
      setSubmitting(true);
      setServerError("");

      await taskService.updateTask(
        projectId,
        taskId,
        taskData,
      );

      navigate(`/projects/${projectId}`);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to update task.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  if (pageLoading) {
    return <PageLoader message="Loading task..." />;
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
          Edit Task
        </span>
      </nav>

      <div>
        <h1
          className="
            text-2xl font-bold tracking-tight text-text
            sm:text-3xl
          "
        >
          Edit Task
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Update task details for {project?.name}.
        </p>
      </div>

      {serverError && !task ? (
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
          {serverError}
        </div>
      ) : (
        <Card padding={false}>
          <CardHeader className="border-b border-border px-6 py-5">
            <CardTitle>Task Details</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <TaskForm
              members={members}
              defaultValues={task}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={submitting}
              serverError={serverError}
              submitLabel="Save Changes"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditTaskPage;    