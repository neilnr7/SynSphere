package com.nr.synergysphere.notification.repository;

import com.nr.synergysphere.notification.model.Notification;
import com.nr.synergysphere.user.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);

    Page<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(
            User recipient,
            Pageable pageable
    );

    long countByRecipientAndIsReadFalse(User recipient);

    List<Notification> findByRecipientAndIsReadFalse(User recipient);

    void deleteByRecipient(User recipient);

    @Modifying
    @Transactional
    @Query("""
            UPDATE Notification n
            SET n.isRead = true
            WHERE n.recipient = :recipient
              AND n.isRead = false
            """)
    int markAllAsRead(User recipient);
}
