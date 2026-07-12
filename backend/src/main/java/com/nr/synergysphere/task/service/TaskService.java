package com.nr.synergysphere.task.service;

import com.nr.synergysphere.activity.service.ActivityLogService;
import com.nr.synergysphere.common.enums.ActivityActionType;
import com.nr.synergysphere.common.enums.ActivityEntityType;
import com.nr.synergysphere.common.enums.ProjectRole;
import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.project.repository.ProjectMemberRepository;
import com.nr.synergysphere.project.repository.ProjectRepository;
import com.nr.synergysphere.task.dto.request.CreateTaskRequest;
import com.nr.synergysphere.task.dto.request.UpdateTaskRequest;
import com.nr.synergysphere.task.dto.request.UpdateTaskStatusRequest;
import com.nr.synergysphere.task.dto.response.MyTaskResponse;
import com.nr.synergysphere.task.dto.response.TaskResponse;
import com.nr.synergysphere.task.model.Task;
import com.nr.synergysphere.task.model.TaskStatus;
import com.nr.synergysphere.task.repository.TaskRepository;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.nr.synergysphere.task.specification.TaskSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@RequiredArgsConstructor
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ActivityLogService activityLogService;


    private ProjectMember getProjectMember(Project project, User user){
        return projectMemberRepository.findByProjectAndUser(project,user)
                .orElseThrow(()-> new RuntimeException(("Not a Project Member")));
    }

    private void checkManagerOrOwner(ProjectMember member){
        if(!(member.getRole()== ProjectRole.OWNER || member.getRole()== ProjectRole.MANAGER)){
            throw new RuntimeException("Access Denied");
        }
    }

    public TaskResponse createTask(UUID projectId, CreateTaskRequest request, String email) {

        Project project = projectRepository.findById(projectId).orElseThrow();
        User user = userRepository.findByEmail(email).orElseThrow();
        ProjectMember member = getProjectMember(project, user);
        //  Permission check
        checkManagerOrOwner(member);

        User assignedUser = null;

        if (request.getAssignedTo() != null) {
            assignedUser = userRepository.findById(request.getAssignedTo())
                    .orElseThrow(()-> new RuntimeException("Assigned User not found"));

            // Ensure assigned user is in project
            projectMemberRepository.findByProjectAndUser(project, assignedUser)
                    .orElseThrow(() -> new RuntimeException("Assigned User not in project"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .project(project)
                .createdBy(user)
                .assignedTo(assignedUser)
                .priority(request.getPriority())
                .status(TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .tags(request.getTags())
                .imageUrl(request.getImageUrl())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        taskRepository.save(task);

        //Activity log : Task Created
        activityLogService.createActivityLog(
                project,
                user,
                ActivityActionType.CREATED,
                ActivityEntityType.TASK,
                task.getTaskId(),
                "Task Created: " + task.getTitle()
        );

        // Activity Log - Task Assigned
        if (assignedUser != null) {

            activityLogService.createActivityLog(
                    project,
                    user,
                    ActivityActionType.ASSIGNED,
                    ActivityEntityType.TASK,
                    task.getTaskId(),
                    "Task assigned to " + assignedUser.getEmail()
            );
        }

        // Incrementing task count
        project.setTaskCount(project.getTaskCount() + 1);
        projectRepository.save(project);

        return mapToResponse(task);
    }

    public TaskResponse updateTask(UUID projectId, UUID taskId, UpdateTaskRequest request, String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new RuntimeException("Project not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to this project");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        ProjectMember member = getProjectMember(task.getProject(), user);
        checkManagerOrOwner(member);

        if(request.getTitle() != null)
            task.setTitle(request.getTitle());

        if(request.getDescription() != null)
            task.setDescription(request.getDescription());

        if(request.getPriority() != null)
            task.setPriority(request.getPriority());

        if(request.getDueDate() != null)
            task.setDueDate(request.getDueDate());

        if(request.getTags() != null)
            task.setTags(request.getTags());

        if(request.getImageUrl() != null)
            task.setImageUrl(request.getImageUrl());

        if(request.getAssignedTo()!=null){

            User oldAssignee = task.getAssignedTo();
            User assignedUser = userRepository.findById(request.getAssignedTo())
                            .orElseThrow(()->new RuntimeException("Assigned User not found"));

            projectMemberRepository.findByProjectAndUser(task.getProject(),assignedUser)
                    .orElseThrow(() -> new RuntimeException("User not in project"));

            task.setAssignedTo(assignedUser);

            if(oldAssignee == null || !oldAssignee.getId().equals(assignedUser.getId())) {

                activityLogService.createActivityLog(
                        project,
                        user,
                        ActivityActionType.ASSIGNED,
                        ActivityEntityType.TASK,
                        task.getTaskId(),
                        "Task assigned to " + assignedUser.getEmail()
                );
            }
        }
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);

        activityLogService.createActivityLog(
                project,
                user,
                ActivityActionType.UPDATED,
                ActivityEntityType.TASK,
                task.getTaskId(),
                "Task updated: " + task.getTitle()
        );
        return mapToResponse(task);
    }

    public TaskResponse updateTaskStatus(UUID projectId,UUID taskId, UpdateTaskStatusRequest request, String email) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new RuntimeException("Project not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to this project");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        ProjectMember member = getProjectMember(task.getProject(), user);

        boolean isAssignedUser = task.getAssignedTo() != null &&
                task.getAssignedTo().getId().equals(user.getId());

        boolean isManagerOrOwner =
                member.getRole() == ProjectRole.OWNER ||
                        member.getRole() == ProjectRole.MANAGER;

        if (!(isAssignedUser || isManagerOrOwner)) {
            throw new RuntimeException("Access denied");
        }
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.getStatus());
        task.setUpdatedAt(LocalDateTime.now());

        Task updated_task = taskRepository.save(task);

        activityLogService.createActivityLog(
                project,
                user,
                ActivityActionType.STATUS_CHANGED,
                ActivityEntityType.TASK,
                updated_task.getTaskId(),
                oldStatus + " -> " + updated_task.getStatus()
        );

        return mapToResponse(updated_task);
    }


    public void deleteTask(UUID projectId, UUID taskId, String email) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new RuntimeException("Project not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to this project");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        ProjectMember member = getProjectMember(task.getProject(), user);

        if(member.getRole()!=ProjectRole.OWNER){
            throw new RuntimeException("Only owner can delete task");
        }

        //for activity log we save id and title
        UUID deletedTaskId = task.getTaskId();
        String deletedTaskTitle = task.getTitle();

        activityLogService.createActivityLog(
                project,
                user,
                ActivityActionType.DELETED,
                ActivityEntityType.TASK,
                deletedTaskId,
                "Task deleted: " + deletedTaskTitle
        );

        taskRepository.delete(task);

        project.setTaskCount(project.getTaskCount()-1);

        projectRepository.save(project);

    }


    public List<TaskResponse> getTasksByProject(UUID projectId, String email) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new RuntimeException("Project not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        // 🔐 Must be project member
        getProjectMember(project, user);

        return taskRepository.findByProject(project)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    public Page<TaskResponse> getFilteredTasks(
            UUID projectId,
            TaskStatus status,
            UUID assignedTo,
            String search,
            Pageable pageable,
            String email
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new RuntimeException("Project not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        getProjectMember(project, user);

        Specification<Task> specification =
                TaskSpecification.filterTasks(
                        projectId,
                        status,
                        assignedTo,
                        search
                );

        return taskRepository
                .findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    public Page<MyTaskResponse> getMyTasks(
            String email,
            Pageable pageable
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository
                .findByAssignedTo(user, pageable)
                .map(this::mapToMyTaskResponse);
    }

    public TaskResponse getTaskById(
            UUID projectId,
            UUID taskId,
            String email
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        getProjectMember(project, user);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to this project");
        }

        return mapToResponse(task);
    }

    private MyTaskResponse mapToMyTaskResponse(Task task) {

        return MyTaskResponse.builder()
                .id(task.getTaskId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .assignedTo(
                        task.getAssignedTo() != null
                                ? task.getAssignedTo().getId()
                                : null
                )
                .createdBy(
                        task.getCreatedBy() != null
                                ? task.getCreatedBy().getId()
                                : null
                )
                .projectId(
                        task.getProject() != null
                                ? task.getProject().getId()
                                : null
                )
                .projectName(
                        task.getProject() != null
                                ? task.getProject().getName()
                                : null
                )
                .assigneeName(
                        task.getAssignedTo() != null
                                ? task.getAssignedTo().getName()
                                : null
                )
                .tags(task.getTags())
                .imageUrl(task.getImageUrl())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private TaskResponse mapToResponse(Task task) {

        TaskResponse response = new TaskResponse();

        response.setId(task.getTaskId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());
        response.setTags(task.getTags());
        response.setImageUrl(task.getImageUrl());

        if(task.getAssignedTo()!=null){
            response.setAssignedTo(task.getAssignedTo().getId());
        }

        if(task.getCreatedBy() != null){
            response.setCreatedBy(task.getCreatedBy().getId());
        }

        if(task.getProject() != null){
            response.setProjectId(task.getProject().getId());
        }

        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        return response;
    }

}
