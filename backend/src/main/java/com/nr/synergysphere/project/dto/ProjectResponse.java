package com.nr.synergysphere.project.dto;


import com.nr.synergysphere.common.enums.Priority;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {

    private UUID id;

    private String name;

    private String description;

    private UUID createdById;
    private String createdByName;
    private String createdByEmail;

    private UUID projectManagerId;
    private String projectManagerName;
    private String projectManagerEmail;

    private LocalDateTime deadline;

    private Priority priority;

    private List<String> tags;

    private String imageUrl;

    private Integer taskCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}