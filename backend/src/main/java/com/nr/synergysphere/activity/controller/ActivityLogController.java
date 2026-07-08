package com.nr.synergysphere.activity.controller;

import com.nr.synergysphere.activity.dto.ActivityLogResponse;
import com.nr.synergysphere.activity.service.ActivityLogService;
import com.nr.synergysphere.common.enums.ActivityActionType;
import com.nr.synergysphere.common.enums.ActivityEntityType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/projects/{projectId}/activities")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    public Page<ActivityLogResponse> getActivityLogs(
            @PathVariable UUID projectId,
            @RequestParam(required = false) ActivityActionType actionType,//means its optional
            @RequestParam(required = false) ActivityEntityType entityType,
            Pageable pageable,
            Authentication authentication
    ) {

        return activityLogService.getFilteredActivityLogs(
                projectId,
                actionType,
                entityType,
                pageable,
                authentication.getName()
        );
    }
}