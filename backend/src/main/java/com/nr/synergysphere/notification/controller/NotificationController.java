package com.nr.synergysphere.notification.controller;

import com.nr.synergysphere.notification.dto.MarkNotificationReadRequest;
import com.nr.synergysphere.notification.dto.NotificationCountResponse;
import com.nr.synergysphere.notification.dto.NotificationResponse;
import com.nr.synergysphere.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            Pageable pageable,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                notificationService.getNotifications(
                        authentication.getName(),
                        pageable
                )
        );
    }

    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationResponse>> getUnreadNotifications(
            Pageable pageable,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(
                        authentication.getName(),
                        pageable
                )
        );
    }

    @GetMapping("/unread/count")
    public ResponseEntity<NotificationCountResponse> getUnreadNotificationCount(
            Authentication authentication
    ){
        return ResponseEntity.ok(
                notificationService.getUnreadNotificationCount(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> markNotificationRead(
            @PathVariable UUID notificationId,
            @RequestBody MarkNotificationReadRequest request,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                notificationService.markNotificationRead(
                        notificationId,
                        request,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/read-all")
    public ResponseEntity<String> markAllNotificationsRead(Authentication authentication) {
        notificationService.markAllNotificationsRead(authentication.getName());
        return ResponseEntity.ok("All notifications marked as read.");
    }
}