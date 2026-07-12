import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { PRIORITY_OPTIONS } from "@/constants/enums";

const TaskForm = ({
  members = [],
  defaultValues = {},
  onSubmit,
  onCancel,
  loading = false,
  serverError = "",
  submitLabel = "Save Task",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: defaultValues.title || "",
      assignedTo: defaultValues.assignedTo || "",
      priority: defaultValues.priority || "",
      tags: defaultValues.tags?.join(", ") || "",
      dueDate: defaultValues.dueDate
        ? defaultValues.dueDate.slice(0, 16)
        : "",
      imageUrl: defaultValues.imageUrl || "",
      description: defaultValues.description || "",
    },
  });

  const assigneeOptions = members.map((member) => ({
    value: member.userId,
    label: `${member.name} (${member.email})`,
  }));

  const handleFormSubmit = (data) => {
    const taskData = {
      title: data.title.trim(),
      description: data.description.trim(),
      assignedTo: data.assignedTo || null,
      priority: data.priority,
      dueDate: data.dueDate || null,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      imageUrl: data.imageUrl.trim() || null,
    };

    onSubmit(taskData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {serverError && (
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
      )}

      <Input
        label="Name"
        placeholder="Enter task name"
        error={errors.title?.message}
        {...register("title", {
          required: "Task name is required",
          maxLength: {
            value: 200,
            message: "Task name cannot exceed 200 characters",
          },
        })}
      />

      <Select
        label="Assignee"
        options={assigneeOptions}
        {...register("assignedTo")}
      />

      <Select
        label="Priority"
        options={PRIORITY_OPTIONS}
        error={errors.priority?.message}
        {...register("priority", {
          required: "Priority is required",
        })}
      />

      <Input
        label="Tags"
        placeholder="Spring Boot, React, JWT"
        helperText="Separate tags with commas"
        {...register("tags")}
      />

      <Input
        label="Deadline"
        type="datetime-local"
        error={errors.dueDate?.message}
        {...register("dueDate", {
          required: "Deadline is required",
        })}
      />

      <Input
        label="Image URL"
        type="url"
        placeholder="https://example.com/task-image.jpg"
        helperText="Optional task cover image"
        error={errors.imageUrl?.message}
        {...register("imageUrl", {
          pattern: {
            value: /^https?:\/\/.+/i,
            message: "Enter a valid image URL",
          },
        })}
      />

      <Textarea
        label="Description"
        placeholder="Describe the task..."
        rows={6}
        error={errors.description?.message}
        {...register("description")}
      />

      <div
        className="
          flex flex-col-reverse gap-3
          border-t border-border
          pt-6
          sm:flex-row sm:justify-end
        "
      >
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Discard
        </Button>

        <Button
          type="submit"
          leftIcon={Save}
          loading={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;