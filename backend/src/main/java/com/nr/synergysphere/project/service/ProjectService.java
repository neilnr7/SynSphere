package com.nr.synergysphere.project.service;


import com.nr.synergysphere.activity.model.ActivityLog;
import com.nr.synergysphere.activity.service.ActivityLogService;
import com.nr.synergysphere.common.enums.ActivityActionType;
import com.nr.synergysphere.common.enums.ActivityEntityType;
import com.nr.synergysphere.common.enums.ProjectRole;
import com.nr.synergysphere.notification.model.Notification;
import com.nr.synergysphere.notification.service.NotificationService;
import com.nr.synergysphere.project.dto.*;
import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.project.repository.ProjectMemberRepository;
import com.nr.synergysphere.project.repository.ProjectRepository;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor//auto creates constructor for all final fields

public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    @Transactional//if first fails second method dosent exec
    public ProjectResponse createProject(CreateProjectRequest request, String userEmail){
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(()-> new RuntimeException("User not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(creator)
                .projectManager(creator) //creator also manager
                .deadline(request.getDeadline())
                .priority(request.getPriority())
                .tags(request.getTags())
                .imageUrl(request.getImageUrl())
                .taskCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        projectRepository.save(project);

        //Add creator as owner
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(creator)
                .role(ProjectRole.OWNER)
                .joinedAt(LocalDateTime.now())
                .build();
        projectMemberRepository.save(member);

        activityLogService.createActivityLog(
                project,
                creator,
                ActivityActionType.CREATED,
                ActivityEntityType.PROJECT,
                project.getId(),
                "Project \"" + project.getName() + "\" was created"
        );


        return mapToResponse(project);
    }

    //Checks who is making the request
    //Verifies if they have permission
    //Adds a new user to the project


    public ProjectResponse updateProject(
            UUID projectId,
            UpdateProjectRequest request,
            String email
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProjectMember member = projectMemberRepository
                .findByProjectAndUser(project, user)
                .orElseThrow(() ->
                        new RuntimeException("You are not a member of this project"));

        if (member.getRole() != ProjectRole.OWNER
                && member.getRole() != ProjectRole.MANAGER) {

            throw new RuntimeException(
                    "Only OWNER or MANAGER can update project"
            );
        }

        if (request.getName() != null)
            project.setName(request.getName());

        if (request.getDescription() != null)
            project.setDescription(request.getDescription());

        if (request.getDeadline() != null)
            project.setDeadline(request.getDeadline());

        if (request.getPriority() != null)
            project.setPriority(request.getPriority());

        if (request.getTags() != null)
            project.setTags(request.getTags());

        if (request.getImageUrl() != null)
            project.setImageUrl(request.getImageUrl());

        project.setUpdatedAt(LocalDateTime.now());

        Project updatedProject =
                projectRepository.save(project);

        activityLogService.createActivityLog(
                updatedProject,
                user,
                ActivityActionType.UPDATED,
                ActivityEntityType.PROJECT,
                updatedProject.getId(),
                "Project \"" + updatedProject.getName() + "\" was updated"
        );

        return mapToResponse(updatedProject);
    }

    public void addMember(UUID projectId, AddMemberRequest request, String currentUserEmail){//person who is adding , he's email

        //project exists?
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new RuntimeException("Project not found"));

        //user exists?
        //the person who is adding
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()-> new RuntimeException("Current User not found"));

        //check membership
        // wether user is part of project or not and gets his role
        //checking wether currentUser is part of the project or not
        ProjectMember currentMember = projectMemberRepository
                .findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("You are not a member of this project"));

        System.out.println("Current User = " + currentUser.getEmail());
        System.out.println("Role = " + currentMember.getRole());

        if(currentMember.getRole() != ProjectRole.MANAGER
        && currentMember.getRole()!= ProjectRole.OWNER){
            throw new RuntimeException("Not allowed to add members");
        }

        User newUser = userRepository.findByEmail(request.getUserEmail())
                .orElseThrow(()-> new RuntimeException("User not found"));

        if(projectMemberRepository.findByProjectAndUser(project,newUser).isPresent()){
            throw new RuntimeException("User already in the project");
        }

        ProjectMember newMember = ProjectMember.builder()
                .project(project)
                .user(newUser)
                .role(request.getRole())
                .joinedAt(LocalDateTime.now())
                .build();


        projectMemberRepository.save(newMember);

        //Get project
        //Get current user
        //Check if current user is part of project
        //Check if they are OWNER/MANAGER
        //Get new user
        //Add new user to project
        //Save

        //activity log
        
        activityLogService.createActivityLog(
                project,
                currentUser,
                ActivityActionType.ADDED,
                ActivityEntityType.MEMBER,
                newMember.getId(),
                newUser.getName() + " was added to the project"
        );
    }


    public void removeMember(UUID projectId, UUID userId, String currentUserEmail) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        ProjectMember currentMember = projectMemberRepository
                .findByProjectAndUser(project, currentUser)
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));

        if (currentMember.getRole() != ProjectRole.MANAGER
                && currentMember.getRole() != ProjectRole.OWNER) {
            throw new RuntimeException("Not allowed to remove members");
        }

        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("The user you want to remove was not found"));

        ProjectMember memberToRemove = projectMemberRepository
                .findByProjectAndUser(project, userToRemove)
                .orElseThrow(() ->
                        new RuntimeException("The user is not a member of this project"));

        projectMemberRepository.delete(memberToRemove);

        activityLogService.createActivityLog(
                project,
                currentUser,
                ActivityActionType.REMOVED,
                ActivityEntityType.MEMBER,
                memberToRemove.getId(),
                userToRemove.getName() + " was removed from the project"
        );
    }

    public List<MemberResponse> getProjectMembers(UUID projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new RuntimeException("Project not found"));

        return projectMemberRepository
                .findByProject(project)
                .stream()
                .map(member -> MemberResponse.builder()
                        .userId(member.getUser().getId())
                        .name(member.getUser().getName())
                        .email(member.getUser().getEmail())
                        .role(member.getRole())
                        .joinedAt(member.getJoinedAt())
                        .build())
                .toList();
    }


    public ProjectResponse getProjectById(UUID projectId, String email) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        projectMemberRepository.findByProjectAndUser(project, user)
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));

        return mapToResponse(project);
    }

    public List<ProjectResponse> getProjects(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return projectMemberRepository
                .findByUser(user)
                .stream()
                .map(ProjectMember::getProject)
                .map(this::mapToResponse)
                .toList();
    }

    private ProjectResponse mapToResponse(Project project) {

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())

                .createdById(project.getCreatedBy().getId())
                .createdByName(project.getCreatedBy().getName())
                .createdByEmail(project.getCreatedBy().getEmail())

                .projectManagerId(project.getProjectManager().getId())
                .projectManagerName(project.getProjectManager().getName())
                .projectManagerEmail(project.getProjectManager().getEmail())

                .deadline(project.getDeadline())
                .priority(project.getPriority())
                .tags(project.getTags())
                .imageUrl(project.getImageUrl())
                .taskCount(project.getTaskCount())

                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

}
