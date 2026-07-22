import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ListTodo,
  Users,
} from "lucide-react";
import { Link , useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import PageLoader from "@/components/common/PageLoader";
import analyticsService from "@/services/analyticsService";

const ProjectDashboardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  const [overdueTasks, setOverdueTasks] = useState([]);
  const [overduePage, setOverduePage] = useState(null);
  const [loadingMoreOverdue, setLoadingMoreOverdue] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashboardData, overdueData] = await Promise.all([
          analyticsService.getProjectDashboard(projectId),
          analyticsService.getOverdueTasks(projectId, {
            page: 0,
            size: 5,
          }),
        ]);

        setDashboard(dashboardData);
        setOverdueTasks(overdueData.content || []);
        setOverduePage(overdueData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to load project dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [projectId]);

  const handleOverdueTaskClick = (task) => {
    navigate(
      `/projects/${projectId}/tasks/${task.taskId}`,
    );
  };

  const handleLoadMoreOverdue = async () => {
    if (!overduePage || overduePage.last) {
      return;
    }

    try {
      setLoadingMoreOverdue(true);
      setError("");

      const nextPage = overduePage.number + 1;

      const overdueData =
        await analyticsService.getOverdueTasks(projectId, {
          page: nextPage,
          size: 5,
        });

      setOverdueTasks((currentTasks) => [
        ...currentTasks,
        ...(overdueData.content || []),
      ]);

      setOverduePage(overdueData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to load more overdue tasks.",
      );
    } finally {
      setLoadingMoreOverdue(false);
    }
  };

  const formatDeadline = (deadline) => {
    if (!deadline) {
        return "No deadline";
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(deadline));
  };

  if (loading) {
    return (
      <PageLoader message="Loading project dashboard..." />
    );
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

  const projectStatistics = dashboard?.projectStatistics;
  const taskStatistics = dashboard?.taskStatistics;
  const completionStatistics =
    dashboard?.completionStatistics;
  const memberStatistics = dashboard?.memberStatistics || [];

  return (
    <div className="space-y-6">

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

        <Link
            to={`/projects/${projectId}`}
            className="
            truncate
            text-text-secondary
            transition-colors
            hover:text-primary
            "
        >
            {projectStatistics?.projectName}
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-text-secondary">
            Dashboard
        </span>
      </nav>

      <div
        className="
            border-b border-border
            pb-6
        "
        >
        <div
            className="
            flex flex-col gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
            "
        >
            <div className="min-w-0">
            <h1
                className="
                truncate
                text-2xl font-bold tracking-tight text-text
                sm:text-3xl
                "
            >
                {projectStatistics?.projectName}
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
                Track project progress, tasks, and team performance.
            </p>
            </div>

            <Button
            variant="secondary"
            onClick={() => navigate(`/projects/${projectId}`)}
            >
            <ArrowLeft className="h-4 w-4" />
            View Project
            </Button>
        </div>

        <div
            className="
            mt-5 flex flex-wrap
            items-center gap-3
            "
        >
            <span
            className={`
                rounded-full
                px-3 py-1
                text-xs font-semibold
                ${
                projectStatistics?.priority === "HIGH"
                    ? "bg-danger/10 text-danger"
                    : projectStatistics?.priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                    : "bg-success/10 text-success"
                }
            `}
            >
            {projectStatistics?.priority
                ? `${projectStatistics.priority} PRIORITY`
                : "NO PRIORITY"}
            </span>

            <div
            className="
                flex items-center gap-2
                text-sm text-text-secondary
            "
            >
            <CalendarDays className="h-4 w-4 text-text-muted" />

            <span>
                Deadline {formatDeadline(projectStatistics?.deadline)}
            </span>
            </div>
        </div>
        </div>

      <div
        className="
          grid grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <div
          className="
            rounded-card
            border border-border
            bg-surface
            p-5
          "
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">
              Total Tasks
            </p>

            <div
              className="
                rounded-button
                bg-yellow-100
                p-2
                text-yellow-600
                dark:bg-yellow-500/10
                dark:text-yellow-300
              "
            >
              <ListTodo className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold text-text">
            {projectStatistics?.totalTasks ?? 0}
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Tasks in this project
          </p>
        </div>

        <div
          className="
            rounded-card
            border border-border
            bg-surface
            p-5
          "
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">
              Total Members
            </p>

            <div
              className="
                rounded-button
                bg-primary-light
                p-2
                text-primary
              "
            >
              <Users className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold text-text">
            {projectStatistics?.totalMembers ?? 0}
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Project members
          </p>
        </div>

        <div
          className="
            rounded-card
            border border-border
            bg-surface
            p-5
          "
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">
              Completion
            </p>

            <div
              className="
                rounded-button
                bg-success/10
                p-2
                text-success
              "
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold text-text">
            {completionStatistics?.completionPercentage ?? 0}%
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Project completion
          </p>
        </div>

        <div
          className="
            rounded-card
            border border-border
            bg-surface
            p-5
          "
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">
              Overdue Tasks
            </p>

            <div
              className="
                rounded-button
                bg-danger/10
                p-2
                text-danger
              "
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold text-text">
            {dashboard?.overdueTaskCount ?? 0}
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Tasks past their due date
          </p>
        </div>
      </div>

      <div
        className="
          grid grid-cols-1
          gap-6
          xl:grid-cols-2
        "
      >
        <div
          className="
            rounded-card
            border border-border
            bg-surface
            p-5
            sm:p-6
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-text">
              Task Status
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Current task distribution by status.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-text-secondary">
                  To Do
                </p>

                <p className="text-sm font-semibold text-text">
                  {taskStatistics?.todoTasks ?? 0}
                </p>
              </div>

              <div
                className="
                  mt-2 h-2
                  overflow-hidden
                  rounded-full
                  bg-surface-secondary
                "
              >
                <div
                  className="
                    h-full rounded-full
                    bg-text-muted
                    transition-all
                  "
                  style={{
                    width: `${
                      taskStatistics?.totalTasks
                        ? (taskStatistics.todoTasks /
                            taskStatistics.totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-text-secondary">
                  In Progress
                </p>

                <p className="text-sm font-semibold text-text">
                  {taskStatistics?.inProgressTasks ?? 0}
                </p>
              </div>

              <div
                className="
                  mt-2 h-2
                  overflow-hidden
                  rounded-full
                  bg-surface-secondary
                "
              >
                <div
                  className="
                    h-full rounded-full
                    bg-primary
                    transition-all
                  "
                  style={{
                    width: `${
                      taskStatistics?.totalTasks
                        ? (taskStatistics.inProgressTasks /
                            taskStatistics.totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-text-secondary">
                  Done
                </p>

                <p className="text-sm font-semibold text-text">
                  {taskStatistics?.doneTasks ?? 0}
                </p>
              </div>

              <div
                className="
                  mt-2 h-2
                  overflow-hidden
                  rounded-full
                  bg-surface-secondary
                "
              >
                <div
                  className="
                    h-full rounded-full
                    bg-success
                    transition-all
                  "
                  style={{
                    width: `${
                      taskStatistics?.totalTasks
                        ? (taskStatistics.doneTasks /
                            taskStatistics.totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            rounded-card
            border border-border
            bg-surface
            p-5
            sm:p-6
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-text">
              Project Completion
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Overall progress based on completed tasks.
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-bold text-text">
                  {completionStatistics?.completionPercentage ?? 0}%
                </p>

                <p className="mt-1 text-sm text-text-muted">
                  Complete
                </p>
              </div>

              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>

            <div
              className="
                mt-6 h-3
                overflow-hidden
                rounded-full
                bg-surface-secondary
              "
            >
              <div
                className="
                  h-full rounded-full
                  bg-success
                  transition-all
                "
                style={{
                  width: `${
                    completionStatistics?.completionPercentage ?? 0
                  }%`,
                }}
              />
            </div>

            <div
              className="
                mt-6 grid grid-cols-2
                gap-4
              "
            >
              <div
                className="
                  rounded-card
                  bg-surface-secondary
                  p-4
                "
              >
                <p className="text-sm text-text-secondary">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {completionStatistics?.completedTasks ?? 0}
                </p>
              </div>

              <div
                className="
                  rounded-card
                  bg-surface-secondary
                  p-4
                "
              >
                <p className="text-sm text-text-secondary">
                  Remaining
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {completionStatistics?.remainingTasks ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          rounded-card
          border border-border
          bg-surface
          p-5
          sm:p-6
        "
      >
        <div>
          <h2 className="text-lg font-semibold text-text">
            Task Priority
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Task distribution based on priority level.
          </p>
        </div>

        <div
          className="
            mt-6 grid grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          <div
            className="
              rounded-card
              border border-danger/20
              bg-danger/5
              p-5
            "
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-danger">
                High Priority
              </p>

              <span
                className="
                  h-2.5 w-2.5
                  rounded-full
                  bg-danger
                "
              />
            </div>

            <p className="mt-4 text-3xl font-bold text-text">
              {taskStatistics?.highPriorityTasks ?? 0}
            </p>

            <p className="mt-1 text-sm text-text-muted">
              High priority tasks
            </p>
          </div>

          <div
            className="
              rounded-card
              border border-yellow-200
              bg-yellow-50
              p-5
              dark:border-yellow-500/20
              dark:bg-yellow-500/5
            "
          >
            <div className="flex items-center justify-between gap-4">
              <p
                className="
                  text-sm font-medium
                  text-yellow-700
                  dark:text-yellow-400
                "
              >
                Medium Priority
              </p>

              <span
                className="
                  h-2.5 w-2.5
                  rounded-full
                  bg-yellow-500
                "
              />
            </div>

            <p className="mt-4 text-3xl font-bold text-text">
              {taskStatistics?.mediumPriorityTasks ?? 0}
            </p>

            <p className="mt-1 text-sm text-text-muted">
              Medium priority tasks
            </p>
          </div>

          <div
            className="
              rounded-card
              border border-success/20
              bg-success/5
              p-5
            "
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-success">
                Low Priority
              </p>

              <span
                className="
                  h-2.5 w-2.5
                  rounded-full
                  bg-success
                "
              />
            </div>

            <p className="mt-4 text-3xl font-bold text-text">
              {taskStatistics?.lowPriorityTasks ?? 0}
            </p>

            <p className="mt-1 text-sm text-text-muted">
              Low priority tasks
            </p>
          </div>
        </div>
      </div>

      <div
        className="
          rounded-card
          border border-border
          bg-surface
          p-5
          sm:p-6
        "
      >
        <div>
          <h2 className="text-lg font-semibold text-text">
            Team Performance
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Task assignment and completion statistics for project
            members.
          </p>
        </div>

        <div
          className="
            mt-6 grid grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {memberStatistics.map((member) => {
            const completionPercentage =
              member.totalAssignedTasks
                ? (member.completedTasks /
                    member.totalAssignedTasks) *
                  100
                : 0;

            return (
              <div
                key={member.userId}
                className="
                  flex h-full flex-col
                  rounded-card
                  border border-border
                  bg-surface-secondary
                  p-5
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      font-semibold text-text
                    "
                  >
                    {member.userName}
                  </p>

                  <p
                    className="
                      mt-1 truncate
                      text-sm text-text-muted
                    "
                  >
                    {member.userEmail}
                  </p>
                </div>

                <div
                  className="
                    mt-5 grid grid-cols-3
                    gap-3
                    border-y border-border
                    py-4
                  "
                >
                  <div className="text-center">
                    <p className="text-xl font-bold text-text">
                      {member.totalAssignedTasks}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Assigned
                    </p>
                  </div>

                  <div
                    className="
                      border-x border-border
                      text-center
                    "
                  >
                    <p className="text-xl font-bold text-success">
                      {member.completedTasks}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Completed
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">
                      {member.pendingTasks}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Pending
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div
                    className="
                      flex items-center justify-between gap-4
                      text-sm
                    "
                  >
                    <span className="text-text-secondary">
                      Completion
                    </span>

                    <span className="font-semibold text-text">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>

                  <div
                    className="
                      mt-2 h-2
                      overflow-hidden
                      rounded-full
                      bg-background
                    "
                  >
                    <div
                      className="
                        h-full rounded-full
                        bg-success
                        transition-all
                      "
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="
          rounded-card
          border border-border
          bg-surface
          p-5
          sm:p-6
        "
      >
        <div>
          <h2 className="text-lg font-semibold text-text">
            Overdue Tasks
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Incomplete tasks that have passed their due date.
          </p>
        </div>

        {overdueTasks.length === 0 ? (
          <div
            className="
              mt-6
              rounded-card
              border border-border
              bg-surface-secondary
              px-4 py-8
              text-center
            "
          >
            <CheckCircle2
              className="
                mx-auto h-8 w-8
                text-success
              "
            />

            <p className="mt-3 font-medium text-text">
              No overdue tasks
            </p>

            <p className="mt-1 text-sm text-text-muted">
              All active tasks are currently on schedule.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {overdueTasks.map((task) => (
              <button
                key={task.taskId}
                type="button"
                onClick={() => handleOverdueTaskClick(task)}
                className="
                  flex w-full
                  flex-col gap-4
                  rounded-card
                  border border-danger/20
                  bg-danger/5
                  p-4
                  text-left
                  transition-colors
                  hover:bg-danger/10
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      font-semibold text-text
                    "
                  >
                    {task.title}
                  </p>

                  <p className="mt-1 text-sm text-text-muted">
                    {task.assignedTo
                      ? `Assigned to ${task.assignedTo}`
                      : "Unassigned"}
                  </p>
                </div>

                <div
                  className="
                    flex shrink-0
                    items-center gap-4
                  "
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-danger">
                      {task.overdueDays}{" "}
                      {task.overdueDays === 1
                        ? "day"
                        : "days"}{" "}
                      overdue
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      {task.status.replaceAll("_", " ")}
                    </p>
                  </div>

                  <ChevronRight
                    className="
                      h-5 w-5
                      text-text-muted
                    "
                  />
                </div>
              </button>
            ))}

            {overduePage && !overduePage.last && (
              <div className="flex justify-center pt-3">
                <Button
                  variant="secondary"
                  loading={loadingMoreOverdue}
                  onClick={handleLoadMoreOverdue}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboardPage;