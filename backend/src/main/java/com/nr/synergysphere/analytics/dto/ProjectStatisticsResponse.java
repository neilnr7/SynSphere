package com.nr.synergysphere.analytics.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@Setter
public class ProjectStatisticsResponse {

    private UUID projectId;

    private String projectName;

    private Integer totalMembers;

    private Integer totalTasks;

    private LocalDateTime deadline;

    private String priority;
}
