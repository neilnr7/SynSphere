import { useEffect, useState } from "react";
import projectService from "@/services/projectService";
import useAuth from "@/hooks/useAuth";
import {
  CalendarDays,
  ChevronRight,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/common/EmptyState";
import PageLoader from "@/components/common/PageLoader";
import taskService from "@/services/taskService";
import commentService from "@/services/commentService";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/modals/ConfirmModal";


const TaskDetailPage = () => {
  const { projectId, taskId } = useParams();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);

  const [members, setMembers] = useState([]);

  const [commentToEdit, setCommentToEdit] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [updatingComment, setUpdatingComment] =
   useState(false);

  const [commentToDelete, setCommentToDelete] =
    useState(null);
  const [deletingComment, setDeletingComment] =
    useState(false); 

  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] =
   useState(false);
  const [commentError, setCommentError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        setError("");

        const [taskData, commentData, memberData] =
            await Promise.all([
                taskService.getTaskById(projectId, taskId),
                commentService.getComments(projectId, taskId),
                projectService.getProjectMembers(projectId),
            ]);

        setTask(taskData);
        setComments(commentData || []);
        setMembers(memberData || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to load task.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [projectId, taskId]);

  const formatDueDate = (dueDate) => {
    if (!dueDate) {
      return "No due date";
    }

    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dueDate));
  };

  const formatCommentDate = (date) => {
    if (!date) {
      return "";
    }

    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const currentMember = members.find(
    (member) => member.email === user?.email,
    );

    const canEditComment = (comment) => {
    if (!currentMember) {
        return false;
    }

    const isOwner = currentMember.role === "OWNER";

    const isCommentCreator =
        comment.userId === currentMember.userId;

    return isOwner || isCommentCreator;
    };

    const canDeleteComment = (comment) => {
    if (!currentMember) {
        return false;
    }

    const isOwner = currentMember.role === "OWNER";

    const isCommentCreator =
        comment.userId === currentMember.userId;

    return isOwner || isCommentCreator;
    };

  const handleCreateComment = async (event) => {
    event.preventDefault();

    const content = commentContent.trim();

    if (!content || submittingComment) {
        return;
    }

    try {
        setSubmittingComment(true);
        setCommentError("");

        const createdComment =
        await commentService.createComment(
            projectId,
            taskId,
            {
            content,
            },
        );

        setComments((currentComments) => [
        ...currentComments,
        createdComment,
        ]);

        setCommentContent("");
    } catch (err) {
        setCommentError(
        err.response?.data?.message ||
            err.response?.data ||
            "Unable to add comment.",
        );
    } finally {
        setSubmittingComment(false);
    }
    };

  if (loading) {
    return <PageLoader message="Loading task..." />;
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

  const handleStartEditComment = (comment) => {
    setCommentToEdit(comment);
    setEditContent(comment.content);
    setCommentError("");
    };

    const handleCancelEditComment = () => {
    if (updatingComment) {
        return;
    }

    setCommentToEdit(null);
    setEditContent("");
    setCommentError("");
    };

    const handleUpdateComment = async (event) => {
    event.preventDefault();

    const content = editContent.trim();

    if (
        !commentToEdit ||
        !content ||
        updatingComment
    ) {
        return;
    }

    try {
        setUpdatingComment(true);
        setCommentError("");

        const updatedComment =
        await commentService.updateComment(
            projectId,
            taskId,
            commentToEdit.id,
            {
            content,
            },
        );

        setComments((currentComments) =>
        currentComments.map((comment) =>
            comment.id === updatedComment.id
            ? updatedComment
            : comment,
        ),
        );

        setCommentToEdit(null);
        setEditContent("");
    } catch (err) {
        setCommentError(
        err.response?.data?.message ||
            err.response?.data ||
            "Unable to update comment.",
        );
    } finally {
        setUpdatingComment(false);
    }
    };

    const handleDeleteComment = (comment) => {
      setCommentToDelete(comment);
      setCommentError("");
    };

    const handleCancelDeleteComment = () => {
      if (deletingComment) {
        return;
      }

      setCommentToDelete(null);
    };

    const handleConfirmDeleteComment = async () => {
      if (!commentToDelete || deletingComment) {
        return;
      }

      try {
        setDeletingComment(true);
        setCommentError("");

        await commentService.deleteComment(
          projectId,
          taskId,
          commentToDelete.id,
        );

        setComments((currentComments) =>
          currentComments.filter(
            (comment) =>
              comment.id !== commentToDelete.id,
          ),
        );

        if (commentToEdit?.id === commentToDelete.id) {
          setCommentToEdit(null);
          setEditContent("");
        }

        setCommentToDelete(null);
      } catch (err) {
        setCommentError(
          err.response?.data?.message ||
            err.response?.data ||
            "Unable to delete comment.",
        );
      } finally {
        setDeletingComment(false);
      }
    };

  return (
    <div className="space-y-6">
      <div
        className="
          border-b border-border
          pb-6
        "
      >
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
              transition-colors
              hover:text-primary
            "
          >
            Project
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="truncate text-text-secondary">
            {task?.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Badge type="status" value={task?.status} />
          <Badge type="priority" value={task?.priority} />
        </div>

        <h1
          className="
            mt-4
            text-2xl font-bold tracking-tight text-text
            sm:text-3xl
          "
        >
          {task?.title}
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          View task information and collaborate through comments.
        </p>
      </div>

      <div
        className="
          rounded-card border border-border
          bg-surface p-6
        "
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap text-text-secondary">
              {task?.description || "No description provided."}
            </p>
          </div>

          <div
            className="
              flex items-center gap-2
              border-t border-border
              pt-5
              text-sm text-text-secondary
            "
          >
            <CalendarDays className="h-4 w-4 text-text-muted" />

            <span>Due {formatDueDate(task?.dueDate)}</span>
          </div>
        </div>
      </div>

      <section
        className="
          rounded-card border border-border
          bg-surface p-6
        "
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text">
            Comments
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Discuss progress and collaborate with project members.
          </p>
        </div>

        <form
            onSubmit={handleCreateComment}
            className="
                mb-6
                border-b border-border
                pb-6
            "
            >
            <label
                htmlFor="comment-content"
                className="sr-only"
            >
                Add a comment
            </label>

            <textarea
                id="comment-content"
                value={commentContent}
                onChange={(event) =>
                setCommentContent(event.target.value)
                }
                placeholder="Write a comment..."
                rows={3}
                className="
                w-full resize-none
                rounded-xl border border-border
                bg-surface-secondary
                px-4 py-3
                text-sm text-text
                outline-none
                transition-colors
                placeholder:text-text-muted
                focus:border-primary
                "
            />

            {commentError && (
                <p
                role="alert"
                className="mt-2 text-sm text-danger"
                >
                {commentError}
                </p>
            )}

            <div className="mt-3 flex justify-end">
                <Button
                type="submit"
                disabled={
                    !commentContent.trim() || submittingComment
                }
                >
                {submittingComment ? "Commenting..." : "Comment"}
                </Button>
            </div>
            </form>

        {comments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No comments yet"
            description="Start the conversation for this task."
          />
        ) : (
          <div className="space-y-5">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="
                  flex gap-3
                  border-b border-border
                  pb-5
                  last:border-b-0
                  last:pb-0
                "
              >
                <Avatar name={comment.userName} size="sm" />

                <div className="min-w-0 flex-1">
                  <div
                    className="
                        flex flex-col gap-1
                        sm:flex-row sm:items-center
                        sm:justify-between
                    "
                    >
                    <p className="font-medium text-text">
                        {comment.userName}
                    </p>

                    <div className="flex items-center gap-2">
                        <p className="text-xs text-text-muted">
                        {formatCommentDate(comment.createdAt)}

                        {comment.updatedAt &&
                            comment.createdAt !== comment.updatedAt &&
                            " · edited"}
                        </p>

                        {canEditComment(comment) && (
                        <button
                            type="button"
                            aria-label="Edit comment"
                            onClick={() =>
                            handleStartEditComment(comment)
                            }
                            className="
                            flex h-7 w-7 items-center justify-center
                            rounded-lg
                            text-text-muted
                            transition-colors
                            hover:bg-surface-secondary
                            hover:text-text
                            "
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                        )}

                        {canDeleteComment(comment) && (
                        <button
                            type="button"
                            aria-label="Delete comment"
                            onClick={() => handleDeleteComment(comment)}
                            className="
                            flex h-7 w-7 items-center justify-center
                            rounded-lg
                            text-text-muted
                            transition-colors
                            hover:bg-danger/5
                            hover:text-danger
                            "
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        )}
                    </div>
                    </div>

                    {commentToEdit?.id === comment.id ? (
                    <form
                        onSubmit={handleUpdateComment}
                        className="mt-3"
                    >
                        <textarea
                        value={editContent}
                        onChange={(event) =>
                            setEditContent(event.target.value)
                        }
                        rows={3}
                        className="
                            w-full resize-none
                            rounded-xl border border-border
                            bg-surface-secondary
                            px-4 py-3
                            text-sm text-text
                            outline-none
                            transition-colors
                            focus:border-primary
                        "
                        />

                        <div
                        className="
                            mt-3 flex items-center justify-end gap-2
                        "
                        >
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancelEditComment}
                            disabled={updatingComment}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                            !editContent.trim() || updatingComment
                            }
                        >
                            {updatingComment ? "Saving..." : "Save"}
                        </Button>
                        </div>
                    </form>
                    ) : (
                    <p
                        className="
                        mt-2 whitespace-pre-wrap
                        break-words
                        text-sm text-text-secondary
                        "
                    >
                        {comment.content}
                    </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmModal
        open={Boolean(commentToDelete)}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete Comment"
        loading={deletingComment}
        onConfirm={handleConfirmDeleteComment}
        onCancel={handleCancelDeleteComment}
      />
    </div>
  );
};

export default TaskDetailPage;

