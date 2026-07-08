package com.nr.synergysphere.analytics.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Builder
@Getter
@Setter
public class TaskStatisticsResponse {

    private Integer totalTasks;

    private Integer todoTasks;

    private Integer inProgressTasks;

    private Integer doneTasks;

    private Integer lowPriorityTasks;

    private Integer mediumPriorityTasks;

    private Integer highPriorityTasks;
}