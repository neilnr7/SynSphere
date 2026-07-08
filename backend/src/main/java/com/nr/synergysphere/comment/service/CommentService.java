package com.nr.synergysphere.comment.service;

import com.nr.synergysphere.activity.service.ActivityLogService;
import com.nr.synergysphere.comment.dto.CommentResponse;
import com.nr.synergysphere.comment.dto.CreateCommentRequest;
import com.nr.synergysphere.comment.dto.UpdateCommentRequest;
import com.nr.synergysphere.comment.model.Comment;
import com.nr.synergysphere.comment.repository.CommentRepository;
import com.nr.synergysphere.common.enums.ActivityActionType;
import com.nr.synergysphere.common.enums.ActivityEntityType;
import com.nr.synergysphere.common.enums.ProjectRole;
import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.project.repository.ProjectMemberRepository;
import com.nr.synergysphere.project.repository.ProjectRepository;
import com.nr.synergysphere.task.model.Task;
import com.nr.synergysphere.task.repository.TaskRepository;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;



import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

//Only owners and comment creators can update or delete comments
@Service
@RequiredArgsConstructor//so i can inject repos without making constructors
public class CommentService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;


    private final CommentRepository commentRepository;

    public CommentResponse addComment(UUID projectId, UUID taskId,
                                      CreateCommentRequest request, String currentUserEmail){
        //Fetch project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        //Fetch user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        //Verify user belongs to project
        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));

        //Fetch task
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()->new RuntimeException("Task not found"));
        //Verify wether task belongs to project or not
        if(!task.getProject().getId().equals(projectId)){
            throw new RuntimeException("Task does not belong to given project");
        }

        //Create comment
        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(currentUser)
                .task(task)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);

        //activity log
        activityLogService.createActivityLog(
                project,
                currentUser,
                ActivityActionType.ADDED,
                ActivityEntityType.COMMENT,
                comment.getId(),
                "Comment added"
        );

        //return dto
        return mapToResponse(comment);

    }

    public CommentResponse updateComment(UUID projectId, UUID taskId,UUID commentId,
                                         UpdateCommentRequest request, String currentUserEmail){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));


        Task task = taskRepository.findById(taskId)
                .orElseThrow(()->new RuntimeException("Task not found"));

        if(!task.getProject().getId().equals(projectId)){
            throw new RuntimeException("Task does not belong to given project");
        }
        //Verify if comment exists
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()->new RuntimeException("Comment does not exist"));

        //Verify comment belongs to task or not
        if (!comment.getTask().getTaskId().equals(taskId)) {
            throw new RuntimeException(
                    "Comment does not belong to task"
            );
        }

        boolean isOwner = projectMember.getRole() == ProjectRole.OWNER;

        boolean isCommentCreator = comment.getUser().getId().equals(currentUser.getId());

        if(!(isOwner || isCommentCreator)){
            throw new RuntimeException("You do not have access to update this comment");
        }



        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        commentRepository.save(comment);

        //activity log
        activityLogService.createActivityLog(
                project,
                currentUser,
                ActivityActionType.UPDATED,
                ActivityEntityType.COMMENT,
                comment.getId(),
                "Comment updated"
        );

        return mapToResponse(comment);
    }

    public void deleteComment(UUID projectId, UUID taskId,UUID commentId,String currentUserEmail){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));


        Task task = taskRepository.findById(taskId)
                .orElseThrow(()->new RuntimeException("Task not found"));

        if(!task.getProject().getId().equals(projectId)){
            throw new RuntimeException("Task does not belong to given project");
        }
        //Verify if comment exists
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(()->new RuntimeException("Comment does not exist"));

        //Verify comment belongs to task or not
        if (!comment.getTask().getTaskId().equals(taskId)) {
            throw new RuntimeException(
                    "Comment does not belong to task"
            );
        }


        boolean isOwner = projectMember.getRole() == ProjectRole.OWNER;

        boolean isCommentCreator = comment.getUser().getId().equals(currentUser.getId());

        if(!(isOwner || isCommentCreator)){
            throw new RuntimeException("You do not have access to delete this comment");
        }

        //activity log
        activityLogService.createActivityLog(
                project,
                currentUser,
                ActivityActionType.DELETED,
                ActivityEntityType.COMMENT,
                comment.getId(),
                "Comment deleted"
        );

        commentRepository.delete(comment);
    }

    public List<CommentResponse> getAllComments(UUID projectId, UUID taskId, String currentUserEmail){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("Project not found"));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("Current User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(()->new RuntimeException("Task not found"));

        ProjectMember projectMember = projectMemberRepository.findByProjectAndUser(project,currentUser)
                .orElseThrow(()-> new RuntimeException("User dosen't belong to this project"));

        if(!task.getProject().getId().equals(projectId)){
            throw new RuntimeException("Task does not belong to given project");
        }


        return commentRepository.findByTaskOrderByCreatedAtAsc(task)
                .stream()
                .map(this::mapToResponse)
                .toList();

        //Get all comments of a task
        //↓
        //Sort oldest → newest
        //↓
        //Convert each Comment entity into CommentResponse DTO
        //↓
        //Return List<CommentResponse>
    }

    private CommentResponse mapToResponse(Comment comment){
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .userEmail(comment.getUser().getEmail())
                .taskId(comment.getTask().getTaskId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

}
