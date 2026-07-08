package com.nr.synergysphere.analytics.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Builder
@Getter
@Setter
public class CompletionStatisticsResponse {

    private Integer completedTasks;

    private Integer remainingTasks;

    private Double completionPercentage;
}