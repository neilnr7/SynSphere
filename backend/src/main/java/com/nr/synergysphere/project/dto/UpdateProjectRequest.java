package com.nr.synergysphere.project.dto;

import com.nr.synergysphere.common.enums.Priority;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UpdateProjectRequest {
    private String name;
    private String description;
    private LocalDateTime deadline;
    private Priority priority;
    private List<String> tags;
    private String imageUrl;
}