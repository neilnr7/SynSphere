import { useCallback, useEffect, useState } from "react";
import { ChevronRight, ListTodo, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import TaskCard from "@/components/cards/TaskCard";
import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import useAuth from "@/hooks/useAuth";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [projectData, memberData, taskPage] =
        await Promise.all([
          projectService.getProjectById(projectId),
          projectService.getProjectMembers(projectId),
          taskService.getTasks(projectId),
        ]);

      setProject(projectData);
      setMembers(memberData);
      setTasks(taskPage.content || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load project tasks.",
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const getTaskAssignee = (task) => {
    if (!task.assignedTo) {
      return null;
    }

    return (
      members.find(
        (member) => member.userId === task.assignedTo,
      ) || null
    );
  };

  const currentMember = members.find(
  (member) => member.email === user?.email,
);

const canEditTasks =
  currentMember?.role === "OWNER" ||
  currentMember?.role === "MANAGER";

const canChangeTaskStatus = (task) => {
if (!currentMember) {
    return false;
}

const isManagerOrOwner =
    currentMember.role === "OWNER" ||
    currentMember.role === "MANAGER";

const isAssignedUser =
    task.assignedTo === currentMember.userId;

return isManagerOrOwner || isAssignedUser;
};

const handleStatusChange = async (task, status) => {
  try {
    setError("");

    const updatedTask = await taskService.updateTaskStatus(
      projectId,
      task.id,
      status,
    );

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id
          ? updatedTask
          : currentTask,
      ),
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.response?.data ||
        "Unable to update task status.",
    );
  }
};

  const handleCreateTask = () => {
    navigate(`/projects/${projectId}/tasks/new`);
  };

  const handleEditTask = (task) => {
    navigate(
      `/projects/${projectId}/tasks/${task.id}/edit`,
    );
  };

  if (loading) {
    return <PageLoader message="Loading project tasks..." />;
  }

  if (error) {
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
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="
          flex flex-col gap-4
          border-b border-border
          pb-6
          sm:flex-row sm:items-end sm:justify-between
        "
      >
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="
              mb-3 flex items-center gap-1
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

            <span className="truncate text-text-secondary">
              {project?.name}
            </span>
          </nav>

          <h1
            className="
              truncate
              text-2xl font-bold tracking-tight text-text
              sm:text-3xl
            "
          >
            {project?.name}
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            View and manage tasks for this project.
          </p>
        </div>

        <Button
          leftIcon={Plus}
          onClick={handleCreateTask}
          className="shrink-0"
        >
          New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Create the first task for this project and start tracking work."
          action={
            <Button
              leftIcon={Plus}
              onClick={handleCreateTask}
            >
              New Task
            </Button>
          }
        />
      ) : (
        <div
          className="
            grid grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {tasks.map((task) => (
            <TaskCard
                key={task.id}
                task={task}
                assignee={getTaskAssignee(task)}
                onEdit={
                    canEditTasks
                    ? handleEditTask
                    : undefined
                }
                onStatusChange={
                    canChangeTaskStatus(task)
                    ? handleStatusChange
                    : undefined
                }
                />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;