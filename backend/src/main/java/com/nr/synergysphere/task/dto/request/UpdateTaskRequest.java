package com.nr.synergysphere.task.dto.request;

import com.nr.synergysphere.task.model.TaskPriority;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UpdateTaskRequest {

    private String title;

    private String description;

    private TaskPriority priority;

    private LocalDateTime dueDate;

    private UUID assignedTo;

    private String[] tags;

    private String imageUrl;
}