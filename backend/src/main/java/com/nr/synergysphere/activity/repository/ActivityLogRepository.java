package com.nr.synergysphere.activity.repository;

import com.nr.synergysphere.activity.model.ActivityLog;
import com.nr.synergysphere.common.enums.ActivityActionType;
import com.nr.synergysphere.common.enums.ActivityEntityType;
import com.nr.synergysphere.project.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    //Used to find particular project logs
    Page<ActivityLog> findByProjectOrderByCreatedAtDesc(
            Project project,
            Pageable pageable
    );

    //Used to find particular project logs with a certain action performed
    Page<ActivityLog> findByProjectAndActionTypeOrderByCreatedAtDesc(
            Project project,
            ActivityActionType actionType,
            Pageable pageable
    );

    //Used to find particular project logs with a certain entity used(comment,task)
    Page<ActivityLog> findByProjectAndEntityTypeOrderByCreatedAtDesc(
            Project project,
            ActivityEntityType entityType,
            Pageable pageable
    );

    //Used to find particular project logs with a certain action performed and certain entity used
    Page<ActivityLog> findByProjectAndActionTypeAndEntityTypeOrderByCreatedAtDesc(
            Project project,
            ActivityActionType actionType,
            ActivityEntityType entityType,
            Pageable pageable
    );
}
