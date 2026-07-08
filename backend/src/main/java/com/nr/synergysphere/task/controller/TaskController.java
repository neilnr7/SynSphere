package com.nr.synergysphere.task.controller;

import com.nr.synergysphere.task.dto.request.CreateTaskRequest;
import com.nr.synergysphere.task.dto.request.UpdateTaskRequest;
import com.nr.synergysphere.task.dto.request.UpdateTaskStatusRequest;
import com.nr.synergysphere.task.dto.response.TaskResponse;
import com.nr.synergysphere.task.model.TaskStatus;
import com.nr.synergysphere.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable UUID projectId,
            @RequestBody CreateTaskRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                taskService.createTask(projectId, request, authentication.getName())
        );
    }



    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @RequestBody UpdateTaskStatusRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                taskService.updateTaskStatus(projectId,taskId, request, authentication.getName())
        );
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @RequestBody UpdateTaskRequest request,
            Authentication authentication
    ){

        return ResponseEntity.ok(
                taskService.updateTask(projectId, taskId, request, authentication.getName())
        );

    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            Authentication authentication
    ){
        taskService.deleteTask(
                projectId,
                taskId,
                authentication.getName()
        );
        return ResponseEntity.ok("Task deleted Successfully");
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getTasks(
            @PathVariable UUID projectId,
            @RequestParam(required=false)
            TaskStatus status,
            @RequestParam(required=false)
            UUID assignedTo,
            @RequestParam(required=false)
            String search,
            @PageableDefault(size=10, sort="createdAt", direction=Sort.Direction.DESC)
            Pageable pageable,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                taskService.getFilteredTasks(
                        projectId,
                        status,
                        assignedTo,
                        search,
                        pageable,
                        authentication.getName()
                )
        );
    }
}
