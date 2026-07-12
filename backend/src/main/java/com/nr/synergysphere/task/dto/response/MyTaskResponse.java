package com.nr.synergysphere.task.dto.response;

import com.nr.synergysphere.task.model.TaskPriority;
import com.nr.synergysphere.task.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyTaskResponse {

    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;

    private UUID assignedTo;
    private UUID createdBy;
    private UUID projectId;

    private String projectName;
    private String assigneeName;

    private String[] tags;
    private String imageUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}