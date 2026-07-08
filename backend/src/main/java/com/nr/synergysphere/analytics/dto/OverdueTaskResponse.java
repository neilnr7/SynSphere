package com.nr.synergysphere.analytics.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;
@Builder
@Getter
@Setter
public class OverdueTaskResponse {

    private UUID taskId;

    private String title;

    private String status;

    private LocalDateTime dueDate;

    private String assignedTo;

    private Long overdueDays;
}
