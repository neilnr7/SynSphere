package com.nr.synergysphere.analytics.repository;

import com.nr.synergysphere.analytics.dto.OverdueTaskResponse;
import com.nr.synergysphere.analytics.dto.UserTaskStatisticsResponse;
import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.project.repository.ProjectMemberRepository;
import com.nr.synergysphere.project.repository.ProjectRepository;
import com.nr.synergysphere.task.model.Task;
import com.nr.synergysphere.task.model.TaskPriority;
import com.nr.synergysphere.task.model.TaskStatus;
import com.nr.synergysphere.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class DashboardAnalyticsRepository {

    private final EntityManager entityManager;

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ProjectMemberRepository projectMemberRepository;

    // PROJECT
    public Long getTotalMembers(Project project) {
        return projectMemberRepository.countByProject(project);
    }


    public Long getTotalTasks(Project project) {
        return taskRepository.countByProject(project);
    }


    // TASK STATUS
    public Long getTodoTasks(Project project) {
        return taskRepository.countByProjectAndStatus(project, TaskStatus.TODO);
    }

    public Long getInProgressTasks(Project project) {
        return taskRepository.countByProjectAndStatus(project, TaskStatus.IN_PROGRESS);
    }

    public Long getDoneTasks(Project project) {
        return taskRepository.countByProjectAndStatus(project, TaskStatus.DONE);
    }

    // TASK PRIORITY
    public Long getLowPriorityTasks(Project project) {
        return taskRepository.countByProjectAndPriority(project, TaskPriority.LOW);
    }

    public Long getMediumPriorityTasks(Project project) {
        return taskRepository.countByProjectAndPriority(project, TaskPriority.MEDIUM);
    }

    public Long getHighPriorityTasks(Project project) {
        return taskRepository.countByProjectAndPriority(project, TaskPriority.HIGH);
    }

    // OVERDUE TASKS
    public Page<OverdueTaskResponse> getOverdueTasks(Project project, Pageable pageable) {

        TypedQuery<Task> query = entityManager.createQuery("""
                SELECT t
                FROM Task t
                WHERE t.project = :project
                AND t.status <> :done
                AND t.dueDate < :now
                ORDER BY t.dueDate ASC
                """, Task.class);

        query.setParameter("project", project);
        query.setParameter("done", TaskStatus.DONE);
        query.setParameter("now", LocalDateTime.now());

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Task> tasks = query.getResultList();

        Long total = entityManager.createQuery("""
                SELECT COUNT(t)
                FROM Task t
                WHERE t.project = :project
                AND t.status <> :done
                AND t.dueDate < :now
                """, Long.class)
                .setParameter("project", project)
                .setParameter("done", TaskStatus.DONE)
                .setParameter("now", LocalDateTime.now())
                .getSingleResult();

        List<OverdueTaskResponse> responses = tasks.stream()
                .map(task -> OverdueTaskResponse.builder()
                        .taskId(task.getTaskId())
                        .title(task.getTitle())
                        .status(task.getStatus().name())
                        .dueDate(task.getDueDate())
                        .assignedTo(
                                task.getAssignedTo() == null
                                        ? null
                                        : task.getAssignedTo().getName())
                        .overdueDays(
                                ChronoUnit.DAYS.between(
                                        task.getDueDate(),
                                        LocalDateTime.now()))
                        .build())
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, total);
    }

    public Long getOverdueTaskCount(Project project) {

        return entityManager.createQuery("""
            SELECT COUNT(t)
            FROM Task t
            WHERE t.project = :project
            AND t.status <> :done
            AND t.dueDate < :now
            """, Long.class)
                .setParameter("project", project)
                .setParameter("done", TaskStatus.DONE)
                .setParameter("now", LocalDateTime.now())
                .getSingleResult();
    }

    // USER TASK STATISTICS
    public List<UserTaskStatisticsResponse> getUserTaskStatistics(Project project) {

        List<ProjectMember> members = projectMemberRepository.findByProject(project);

        // Query 1: Total assigned tasks per user
        TypedQuery<Object[]> totalQuery = entityManager.createQuery("""
            SELECT
                t.assignedTo.id,
                COUNT(t)
            FROM Task t
            WHERE t.project = :project
            AND t.assignedTo IS NOT NULL
            GROUP BY t.assignedTo.id
            """, Object[].class);

        totalQuery.setParameter("project", project);

        Map<UUID, Long> totalTasksMap = totalQuery.getResultList()
                .stream()
                .collect(Collectors.toMap(
                        row -> (UUID) row[0],
                        row -> (Long) row[1]
                ));

        // Query 2: Completed tasks per user
        TypedQuery<Object[]> completedQuery = entityManager.createQuery("""
            SELECT
                t.assignedTo.id,
                COUNT(t)
            FROM Task t
            WHERE t.project = :project
            AND t.assignedTo IS NOT NULL
            AND t.status = :status
            GROUP BY t.assignedTo.id
            """, Object[].class);

        completedQuery.setParameter("project", project);
        completedQuery.setParameter("status", TaskStatus.DONE);

        Map<UUID, Long> completedTasksMap = completedQuery.getResultList()
                .stream()
                .collect(Collectors.toMap(
                        row -> (UUID) row[0],
                        row -> (Long) row[1]
                ));

        return members.stream()
                .map(member -> {

                    UUID userId = member.getUser().getId();

                    int totalAssigned = totalTasksMap
                            .getOrDefault(userId, 0L)
                            .intValue();

                    int completed = completedTasksMap
                            .getOrDefault(userId, 0L)
                            .intValue();

                    return UserTaskStatisticsResponse.builder()
                            .userId(userId)
                            .userName(member.getUser().getName())
                            .userEmail(member.getUser().getEmail())
                            .totalAssignedTasks(totalAssigned)
                            .completedTasks(completed)
                            .pendingTasks(totalAssigned - completed)
                            .build();
                })
                .toList();
    }

    // COMPLETION
    public Double getCompletionPercentage(Project project) {

        long total = getTotalTasks(project);

        if (total == 0)
            return 0.0;

        long done = getDoneTasks(project);

        double percentage = (done * 100.0) / total;

        return  Math.round(percentage * 100.0) / 100.0;
    }


}