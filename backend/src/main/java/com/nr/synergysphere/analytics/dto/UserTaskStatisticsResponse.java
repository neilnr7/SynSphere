package com.nr.synergysphere.analytics.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class UserTaskStatisticsResponse {

    private UUID userId;

    private String userName;

    private String userEmail;

    private Integer totalAssignedTasks;

    private Integer completedTasks;

    private Integer pendingTasks;

}