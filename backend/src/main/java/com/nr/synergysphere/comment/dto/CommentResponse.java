package com.nr.synergysphere.comment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CommentResponse {

    private UUID id;

    private String content;

    private UUID userId;

    private String userName;

    private String userEmail;

    private UUID taskId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}