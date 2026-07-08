package com.nr.synergysphere.notification.model;

import com.nr.synergysphere.activity.model.ActivityLog;
import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.user.model.User;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue
    @Column(name = "notification_id")
    private UUID notification_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private ActivityLog activityLog;

    private Boolean isRead;

    private LocalDateTime createdAt;
}