import { useEffect, useState } from "react";
import { CheckSquare2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import TaskCard from "@/components/cards/TaskCard";
import Button from "@/components/ui/Button";
import taskService from "@/services/taskService";

const MyTasksPage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await taskService.getMyTasks({
          page,
          size: 9,
        });

        setTasks(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load your tasks. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, [page]);

  const handleTaskClick = (task) => {
    navigate(`/projects/${task.projectId}`);
  };

  const handleStatusChange = async (task, status) => {
    try {
      setError("");

      const updatedTask =
        await taskService.updateTaskStatus(
          task.projectId,
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
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update task status. Please try again.",
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

  if (loading) {
    return <PageLoader message="Loading your tasks..." />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          My Tasks
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          View and manage tasks assigned to you.
        </p>
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

      {!error && tasks.length === 0 && (
        <EmptyState
          icon={CheckSquare2}
          title="No tasks assigned"
          description="You currently have no tasks assigned to you."
        />
      )}

      {!error && tasks.length > 0 && (
        <>
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
                assignee={
                  task.assigneeName
                    ? { name: task.assigneeName }
                    : null
                }
                projectName={task.projectName}
                onClick={handleTaskClick}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div
              className="
                mt-8
                flex flex-col gap-3
                sm:flex-row sm:items-center sm:justify-between
              "
            >
              <p className="text-sm text-text-secondary">
                Page {page + 1} of {totalPages}
              </p>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  disabled={page === 0}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>

                <Button
                  variant="secondary"
                  disabled={page >= totalPages - 1}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTasksPage;