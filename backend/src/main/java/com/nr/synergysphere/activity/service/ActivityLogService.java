package com.nr.synergysphere.activity.service;

import com.nr.synergysphere.activity.dto.ActivityLogResponse;
import com.nr.synergysphere.activity.model.ActivityLog;
import com.nr.synergysphere.activity.repository.ActivityLogRepository;
import com.nr.synergysphere.common.enums.ActivityActionType;
import com.nr.synergysphere.common.enums.ActivityEntityType;
import com.nr.synergysphere.notification.service.NotificationService;
import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.project.repository.ProjectMemberRepository;
import com.nr.synergysphere.project.repository.ProjectRepository;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final NotificationService notificationService;
    //Every time Activity Log is created: we automatically generate notifications.

    public Page<ActivityLogResponse> getFilteredActivityLogs(
            UUID projectId,
            ActivityActionType actionType,
            ActivityEntityType entityType,
            Pageable pageable,
            String currentUserEmail
    ){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));

        //Fetch logs
        Page<ActivityLog> logs;
        //All diff types of filters
        if(actionType == null && entityType == null) {
            logs = activityLogRepository.findByProjectOrderByCreatedAtDesc(project,pageable);
        } else if (actionType!=null && entityType == null) {
            logs = activityLogRepository.findByProjectAndActionTypeOrderByCreatedAtDesc(
                    project,actionType,pageable
            );
        } else if (actionType == null && entityType !=null) {
            logs = activityLogRepository.findByProjectAndEntityTypeOrderByCreatedAtDesc(
                    project,entityType,pageable
            );
        }else {
            logs = activityLogRepository.findByProjectAndActionTypeAndEntityTypeOrderByCreatedAtDesc(
                    project,actionType,entityType,pageable
            );
        }

        return logs.map(this::mapToResponse);
    }

    //Helper function to save activities in other modules
    public void createActivityLog(
            Project project,
            User user,
            ActivityActionType actionType,
            ActivityEntityType entityType,
            UUID entityId,
            String metadata
    ) {

        ActivityLog activityLog = ActivityLog.builder()
                .project(project)
                .user(user)
                .actionType(actionType)
                .entityType(entityType)
                .entityId(entityId)
                .metadata(metadata)
                .createdAt(LocalDateTime.now())
                .build();

        ActivityLog savedActivityLog = activityLogRepository.saveAndFlush(activityLog);

        notificationService.createNotifications(savedActivityLog);
    }

    //maps activitylog model to response
    private ActivityLogResponse mapToResponse(ActivityLog activityLog){
        return ActivityLogResponse.builder()
                .activityId(activityLog.getActivityId())
                .projectId(activityLog.getProject().getId())
                .userId(activityLog.getUser().getId())
                .userName(activityLog.getUser().getName())
                .userEmail(activityLog.getUser().getEmail())
                .actionType(activityLog.getActionType())
                .entityType(activityLog.getEntityType())
                .entityId(activityLog.getEntityId())
                .metadata(activityLog.getMetadata())
                .createdAt(activityLog.getCreatedAt())
                .build();
    }
}
