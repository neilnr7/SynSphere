package com.nr.synergysphere.task.controller;

import com.nr.synergysphere.task.dto.response.MyTaskResponse;
import com.nr.synergysphere.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class MyTaskController {

    private final TaskService taskService;

    @GetMapping("/my")
    public ResponseEntity<Page<MyTaskResponse>> getMyTasks(
            @PageableDefault(
                    size = 9,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                taskService.getMyTasks(
                        authentication.getName(),
                        pageable
                )
        );
    }
}
//to view all the asks of a particular user