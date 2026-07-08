package com.nr.synergysphere.activity.dto;

import com.nr.synergysphere.common.enums.ActivityActionType;
import com.nr.synergysphere.common.enums.ActivityEntityType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ActivityLogResponse {

    private UUID activityId;

    private UUID projectId;

    private UUID userId;

    private String userName;

    private String userEmail;

    private ActivityActionType actionType;

    private ActivityEntityType entityType;

    private UUID entityId;

    private String metadata;

    private LocalDateTime createdAt;
}