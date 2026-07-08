package com.nr.synergysphere.analytics.controller;

import com.nr.synergysphere.analytics.dto.DashboardResponse;
import com.nr.synergysphere.analytics.dto.OverdueTaskResponse;
import com.nr.synergysphere.analytics.dto.UserTaskStatisticsResponse;
import com.nr.synergysphere.analytics.service.DashboardAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/{projectId}/dashboard")
public class DashboardAnalyticsController {

    private final DashboardAnalyticsService dashboardAnalyticsService;

    // Project Dashboard
    //Complete dashboard for the project
    @GetMapping
    public ResponseEntity<DashboardResponse> getProjectDashboard(
            @PathVariable UUID projectId,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                dashboardAnalyticsService.getProjectDashboard(projectId, authentication.getName())
        );
    }

    //Paginated overdue tasks
    @GetMapping("/overdue")
    public ResponseEntity<Page<OverdueTaskResponse>> getOverdueTasks(
            @PathVariable UUID projectId,
            Pageable pageable,
            Authentication authentication
    ){
        return ResponseEntity.ok(dashboardAnalyticsService.getOverdueTasks(
                projectId,
                pageable,
                authentication.getName())
        );
    }


    // User Task Statistics
    // Task Statistics for each project member
    @GetMapping("/member-stats")
    public ResponseEntity<List<UserTaskStatisticsResponse>> getUserTaskStatistics(
            @PathVariable UUID projectId,
            Authentication authentication
    ){
        return ResponseEntity.ok(dashboardAnalyticsService.getUserTaskStatistics(
                projectId,
                authentication.getName())
        );
    }
}