package com.nr.synergysphere.analytics.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class DashboardResponse {

    private ProjectStatisticsResponse projectStatistics;

    private TaskStatisticsResponse taskStatistics;

    private CompletionStatisticsResponse completionStatistics;

    private List<UserTaskStatisticsResponse> memberStatistics;

    private Integer overdueTaskCount;
}