package com.nr.synergysphere.analytics.service;

import com.nr.synergysphere.analytics.dto.*;
import com.nr.synergysphere.analytics.repository.DashboardAnalyticsRepository;
import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.project.repository.ProjectMemberRepository;
import com.nr.synergysphere.project.repository.ProjectRepository;
import com.nr.synergysphere.task.repository.TaskRepository;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardAnalyticsService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final DashboardAnalyticsRepository dashboardAnalyticsRepository;

    public DashboardResponse getProjectDashboard(UUID projectId, String currentUserEmail){
        //Fetch project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        //Fetch user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        //Verify user belongs to project
        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));


        // Project Statistics
        Long totalMembers = dashboardAnalyticsRepository.getTotalMembers(project);
        Long totalTasks = dashboardAnalyticsRepository.getTotalTasks(project);

        ProjectStatisticsResponse projectStatistics = ProjectStatisticsResponse.builder()
                .projectId(project.getId())
                .projectName(project.getName())
                .totalMembers(totalMembers.intValue())
                .totalTasks(totalTasks.intValue())
                .deadline(project.getDeadline())
                .priority(project.getPriority().name())
                .build();

        // Task Statistics
        Long todoTasks = dashboardAnalyticsRepository.getTodoTasks(project);
        Long inProgressTasks = dashboardAnalyticsRepository.getInProgressTasks(project);
        Long doneTasks = dashboardAnalyticsRepository.getDoneTasks(project);

        Long lowPriorityTasks = dashboardAnalyticsRepository.getLowPriorityTasks(project);
        Long mediumPriorityTasks = dashboardAnalyticsRepository.getMediumPriorityTasks(project);
        Long highPriorityTasks = dashboardAnalyticsRepository.getHighPriorityTasks(project);

        TaskStatisticsResponse taskStatistics = TaskStatisticsResponse.builder()
                .totalTasks(totalTasks.intValue())
                .todoTasks(todoTasks.intValue())
                .inProgressTasks(inProgressTasks.intValue())
                .doneTasks(doneTasks.intValue())
                .lowPriorityTasks(lowPriorityTasks.intValue())
                .mediumPriorityTasks(mediumPriorityTasks.intValue())
                .highPriorityTasks(highPriorityTasks.intValue())
                .build();

        // Completion Statistics
        Double completionPercentage = dashboardAnalyticsRepository.getCompletionPercentage(project);

        CompletionStatisticsResponse completionStatistics =
                CompletionStatisticsResponse.builder()
                        .completedTasks(doneTasks.intValue())
                        .remainingTasks(totalTasks.intValue() - doneTasks.intValue())
                        .completionPercentage(completionPercentage)
                        .build();

        // Member Statistics
        List<UserTaskStatisticsResponse> memberStatistics =
                dashboardAnalyticsRepository.getUserTaskStatistics(project);

        // Overdue Task Count
        Long overdueTaskCount = dashboardAnalyticsRepository.getOverdueTaskCount(project);

        // Final Response
        return DashboardResponse.builder()
                .projectStatistics(projectStatistics)
                .taskStatistics(taskStatistics)
                .completionStatistics(completionStatistics)
                .memberStatistics(memberStatistics)
                .overdueTaskCount(overdueTaskCount.intValue())
                .build();

    }

    public Page<OverdueTaskResponse> getOverdueTasks(
            UUID projectId,
            Pageable pageable,
            String currentUserEmail) {

        //Fetch project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        //Fetch user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        //Verify user belongs to project
        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));

        return dashboardAnalyticsRepository.getOverdueTasks(project, pageable);
    }

    public List<UserTaskStatisticsResponse> getUserTaskStatistics(
            UUID projectId,
            String currentUserEmail) {

        //Fetch project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        //Fetch user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        //Verify user belongs to project
        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));

        return dashboardAnalyticsRepository.getUserTaskStatistics(project);
    }


}
