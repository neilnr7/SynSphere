import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  ChevronRight,
  ListTodo,
  Plus,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import TaskCard from "@/components/cards/TaskCard";
import ActivityFeed from "@/components/activity/ActivityFeed";
import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import activityService from "@/services/activityService";
import useAuth from "@/hooks/useAuth";
import ConfirmModal from "@/components/modals/ConfirmModal";
import AddMemberModal from "@/components/modals/AddMemberModal";


const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activityPage, setActivityPage] = useState(null);

  const [activityActionFilter, setActivityActionFilter] =
    useState("");

  const [activityEntityFilter, setActivityEntityFilter] =
    useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");
  const [memberError, setMemberError] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        projectData,
        memberData,
        taskPage,
        activityData,
      ] = await Promise.all([
        projectService.getProjectById(projectId),
        projectService.getProjectMembers(projectId),
        taskService.getTasks(projectId, {
          page,
          size: 9,
        }),
        activityService.getProjectActivities(projectId, {
          page: 0,
          size: 10,
          actionType: activityActionFilter || undefined,
          entityType: activityEntityFilter || undefined,
        }),
      ]);

      setProject(projectData);
      setMembers(memberData);
      setTasks(taskPage.content || []);
      setTotalPages(taskPage.totalPages || 0);

      setActivities(activityData.content || []);
      setActivityPage(activityData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load project tasks.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    projectId,
    page,
    activityActionFilter,
    activityEntityFilter,
  ]);

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

  const canDeleteTasks =
    currentMember?.role === "OWNER";

  const canAddMembers =
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

      const activityData =
        await activityService.getProjectActivities(projectId, {
          page: 0,
          size: 10,
        });

      setActivities(activityData.content || []);
      setActivityPage(activityData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to update task status.",
      );
    }
  };

  const handlePreviousPage = () => {
    setPage((currentPage) =>
      Math.max(currentPage - 1, 0),
    );
  };

  const handleNextPage = () => {
    setPage((currentPage) =>
      Math.min(currentPage + 1, totalPages - 1),
    );
  };

  const handleCreateTask = () => {
    navigate(`/projects/${projectId}/tasks/new`);
  };

  const handleOpenDashboard = () => {
    navigate(`/projects/${projectId}/dashboard`);
  };

  const handleEditTask = (task) => {
    navigate(
      `/projects/${projectId}/tasks/${task.id}/edit`,
    );
  };

  const handleOpenAddMember = () => {
    setMemberEmail("");
    setMemberRole("MEMBER");
    setMemberError("");
    setIsAddMemberOpen(true);
  };

  const handleCancelAddMember = () => {
    if (addingMember) {
      return;
    }

    setIsAddMemberOpen(false);
    setMemberEmail("");
    setMemberRole("MEMBER");
    setMemberError("");
  };

  const handleAddMember = async () => {
    try {
      setAddingMember(true);
      setMemberError("");

      await projectService.addProjectMember(projectId, {
        userEmail: memberEmail,
        role: memberRole,
      });

      const [memberData, activityData] = await Promise.all([
        projectService.getProjectMembers(projectId),
        activityService.getProjectActivities(projectId, {
          page: 0,
          size: 10,
        }),
      ]);

      setMembers(memberData);
      setActivities(activityData.content || []);
      setActivityPage(activityData);

      setIsAddMemberOpen(false);
      setMemberEmail("");
      setMemberRole("MEMBER");
    } catch (err) {
      setMemberError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to add member.",
      );
    } finally {
      setAddingMember(false);
    }
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

  const handleTaskClick = (task) => {
    navigate(
      `/projects/${projectId}/tasks/${task.id}`,
    );
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const handleCancelDelete = () => {
    if (deletingTask) {
      return;
    }

    setTaskToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    try {
      setDeletingTask(true);
      setError("");

      await taskService.deleteTask(
        projectId,
        taskToDelete.id,
      );

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskToDelete.id,
        ),
      );

      const activityData =
        await activityService.getProjectActivities(projectId, {
          page: 0,
          size: 10,
        });

      setActivities(activityData.content || []);
      setActivityPage(activityData);

      setTaskToDelete(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to delete task.",
      );
    } finally {
      setDeletingTask(false);
    }
  };

  const handleLoadMoreActivities = async () => {
    if (!activityPage || activityPage.last) {
      return;
    }

    try {
      setError("");

      const nextPage = activityPage.number + 1;

      const activityData =
        await activityService.getProjectActivities(projectId, {
          page: nextPage,
          size: 10,
          actionType: activityActionFilter || undefined,
          entityType: activityEntityFilter || undefined,
        });

      setActivities((currentActivities) => [
        ...currentActivities,
        ...(activityData.content || []),
      ]);

      setActivityPage(activityData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to load more activities.",
      );
    }
  };

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

        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <Button
            variant="secondary"
            leftIcon={BarChart3}
            onClick={handleOpenDashboard}
          >
            Dashboard
          </Button>

          {canAddMembers && (
            <Button
              variant="secondary"
              leftIcon={UserPlus}
              onClick={handleOpenAddMember}
            >
              Add Member
            </Button>
          )}

          {canEditTasks && (
            <Button
              leftIcon={Plus}
              onClick={handleCreateTask}
            >
              New Task
            </Button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Create the first task for this project and start tracking work."
          action={
            canEditTasks ? (
              <Button
                leftIcon={Plus}
                onClick={handleCreateTask}
                className="shrink-0"
              >
                New Task
              </Button>
            ) : null
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
              onClick={handleTaskClick}
              onEdit={
                canEditTasks
                  ? handleEditTask
                  : undefined
              }
              onDelete={
                canDeleteTasks
                  ? handleDeleteTask
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

      {totalPages > 1 && (
        <div
          className="
            flex flex-col gap-3
            border-t border-border
            pt-6
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <p className="text-sm text-text-secondary">
            Page {page + 1} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handlePreviousPage}
              disabled={page === 0}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ActivityFeed
        activities={activities}
        hasMore={activityPage && !activityPage.last}
        onLoadMore={handleLoadMoreActivities}
        actionFilter={activityActionFilter}
        entityFilter={activityEntityFilter}
        onActionFilterChange={setActivityActionFilter}
        onEntityFilterChange={setActivityEntityFilter}
      />

      <AddMemberModal
        open={isAddMemberOpen}
        email={memberEmail}
        role={memberRole}
        error={memberError}
        loading={addingMember}
        onEmailChange={setMemberEmail}
        onRoleChange={setMemberRole}
        onSubmit={handleAddMember}
        onCancel={handleCancelAddMember}
      />

      <ConfirmModal
        open={Boolean(taskToDelete)}
        title="Delete Task"
        description={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Task"
        loading={deletingTask}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ProjectDetailPage;