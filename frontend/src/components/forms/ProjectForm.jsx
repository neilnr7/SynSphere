import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { PRIORITY_OPTIONS } from "@/constants/enums";

const ProjectForm = ({
  defaultValues = {},
  onSubmit,
  onCancel,
  loading = false,
  serverError = "",
  submitLabel = "Save Project",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: defaultValues.name || "",
      description: defaultValues.description || "",
      deadline: defaultValues.deadline
        ? defaultValues.deadline.slice(0, 16)
        : "",
      priority: defaultValues.priority || "",
      tags: defaultValues.tags?.join(", ") || "",
      imageUrl: defaultValues.imageUrl || "",
    },
  });

  const handleFormSubmit = (data) => {
    const projectData = {
      name: data.name.trim(),
      description: data.description.trim(),
      deadline: data.deadline || null,
      priority: data.priority,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      imageUrl: data.imageUrl.trim() || null,
    };

    onSubmit(projectData);
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
        placeholder="Enter project name"
        error={errors.name?.message}
        {...register("name", {
          required: "Project name is required",
          maxLength: {
            value: 200,
            message: "Project name cannot exceed 200 characters",
          },
        })}
      />

      <Input
        label="Tags"
        placeholder="Spring Boot, React, PostgreSQL"
        helperText="Separate tags with commas"
        {...register("tags")}
      />

      <Input
        label="Deadline"
        type="datetime-local"
        error={errors.deadline?.message}
        {...register("deadline", {
          required: "Deadline is required",
        })}
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
        label="Image URL"
        type="url"
        placeholder="https://example.com/project-image.jpg"
        helperText="Optional project cover image"
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
        placeholder="Describe the project..."
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

export default ProjectForm;