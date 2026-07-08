package com.nr.synergysphere.project.controller;

import com.nr.synergysphere.project.dto.*;
import com.nr.synergysphere.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    public ProjectResponse createProject(@RequestBody CreateProjectRequest request, Authentication authentication){//auth user email
        return projectService.createProject(request,authentication.getName());
    }

    @PutMapping("/{projectId}")
    public ProjectResponse updateProject(
            @PathVariable UUID projectId,
            @RequestBody UpdateProjectRequest request,
            Authentication authentication
    ) {
        return projectService.updateProject(projectId,request, authentication.getName()
        );
    }

    @PostMapping("/{projectId}/members")
    public String addMember(@PathVariable UUID projectId,@RequestBody AddMemberRequest request, Authentication authentication){
        projectService.addMember(projectId,request,authentication.getName());
        return "Member was added Successfully";
    }


        @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<String> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        projectService.removeMember(projectId, userId, authentication.getName());
        return ResponseEntity.ok("Member removed successfully");
    }

    @GetMapping("/{projectId}/members")
    public List<MemberResponse> getMembers(@PathVariable UUID projectId) {
        return projectService.getProjectMembers(projectId);
    }

    @GetMapping("/{projectId}")
    public ProjectResponse getProjectById(@PathVariable UUID projectId, Authentication authentication) {
        return projectService.getProjectById(projectId, authentication.getName()
        );
    }

    @GetMapping("/test-auth")
    public String testAuth(Authentication authentication){
        return authentication.getName();
    }
}
