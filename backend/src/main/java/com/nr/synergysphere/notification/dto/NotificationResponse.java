package com.nr.synergysphere.notification.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Data
public class NotificationResponse {

    private UUID notification_id;

    private UUID projectId;

    private UUID activityId;

    private UUID entityId;

    private String actionType;

    private String entityType;

    private String metadata;

    private Boolean isRead;

    private LocalDateTime createdAt;
}