package com.nr.synergysphere.comment.controller;

import com.nr.synergysphere.comment.dto.CommentResponse;
import com.nr.synergysphere.comment.dto.CreateCommentRequest;
import com.nr.synergysphere.comment.dto.UpdateCommentRequest;
import com.nr.synergysphere.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
//i need to create a comment in a project , in a particular task so..
@RequestMapping("/projects/{projectId}/tasks/{taskId}/comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @RequestBody CreateCommentRequest request,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                commentService.addComment(projectId,taskId,request,authentication.getName())
        );
    }
    //ResponseEntity<CommentResponse> means I am returning:
    //    HTTP Response
    //        +
    //    CommentResponse DTO
    //Without ResponseEntity:
    //public CommentResponse addComment(...)  Spring automatically returns: 200 OK
    //with ResponseEntity you control Status Code , Headers, Body
    //@PathVariable UUID projectID : Reads value from URL
    //Spring extracts projectId = UUID.fromString("d25edabc") automatically
    //@RequestBody CreateCommentRequest request : Spring automatically converts JSON body to Java object.
    //where request.getContent() returns JWT completed

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @PathVariable UUID commentId,
            @RequestBody UpdateCommentRequest request,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                commentService.updateComment(projectId,taskId,commentId,request,authentication.getName())
        );
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @PathVariable UUID commentId,
            Authentication authentication
    ){
        commentService.deleteComment(projectId,taskId,commentId,authentication.getName());
        return ResponseEntity.ok("Comment Deleted Successfully");
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getAllComments(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                commentService.getAllComments(projectId,taskId,authentication.getName())
        );
    }








}
