package com.nr.synergysphere.notification.service;

import com.nr.synergysphere.activity.model.ActivityLog;
import com.nr.synergysphere.notification.dto.MarkNotificationReadRequest;
import com.nr.synergysphere.notification.dto.NotificationCountResponse;
import com.nr.synergysphere.notification.dto.NotificationResponse;
import com.nr.synergysphere.notification.model.Notification;
import com.nr.synergysphere.notification.repository.NotificationRepository;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.project.repository.ProjectMemberRepository;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;


    public void createNotifications(ActivityLog activityLog) {

        // Find all project members
        List<ProjectMember> members = projectMemberRepository.findByProject(activityLog.getProject());
        List<Notification> notifications = new ArrayList<>();

        // Create notifications for all members except the sender
        for (ProjectMember member : members) {
            if (member.getUser().getId().equals(activityLog.getUser().getId())){
                continue;
            }

            Notification notification = Notification.builder()
                    .recipient(member.getUser())
                    .project(activityLog.getProject())
                    .activityLog(activityLog)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notifications.add(notification);
        }
        notificationRepository.saveAll(notifications);
    }

    public Page<NotificationResponse> getNotifications(String email, Pageable pageable){
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        Page<Notification> notifications = notificationRepository
                .findByRecipientOrderByCreatedAtDesc(currentUser,pageable);

        return notifications.map(this::mapToResponse);
    }

    public Page<NotificationResponse> getUnreadNotifications(String email, Pageable pageable){
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        Page<Notification> notifications = notificationRepository
                .findByRecipientAndIsReadFalseOrderByCreatedAtDesc(currentUser,pageable);

        return  notifications.map(this::mapToResponse);
    }

    public NotificationCountResponse getUnreadNotificationCount(String email){
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        long count = notificationRepository
                .countByRecipientAndIsReadFalse(currentUser);

        return NotificationCountResponse.builder()
                .count(count)
                .build();
    }

    //mark one message as read
    public NotificationResponse markNotificationRead(
            UUID notificationId,
            MarkNotificationReadRequest request,
            String email){
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(()->new RuntimeException("Notification not found"));

        if(!notification.getRecipient().getId().equals(currentUser.getId())){
            throw new RuntimeException("You are not allowed to update this notification");
        }

        notification.setIsRead(request.getIsRead());
        notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    //mark all as read
    public void markAllNotificationsRead(String email) {

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        notificationRepository.markAllAsRead(currentUser);
    }

    @Transactional
    public void clearNotifications(String email) {

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        notificationRepository.deleteByRecipient(currentUser);
    }

    private NotificationResponse mapToResponse(Notification notification){
        return NotificationResponse.builder()
                .notification_id(notification.getNotification_id())
                .projectId(notification.getProject().getId())
                .activityId(notification.getActivityLog().getActivityId())
                .userId(notification.getActivityLog().getUser().getId())
                .userName(notification.getActivityLog().getUser().getName())
                .userEmail(notification.getActivityLog().getUser().getEmail())
                .entityId(notification.getActivityLog().getEntityId())
                .actionType(notification.getActivityLog().getActionType().name())
                .entityType(notification.getActivityLog().getEntityType().name())
                .metadata(notification.getActivityLog().getMetadata())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
