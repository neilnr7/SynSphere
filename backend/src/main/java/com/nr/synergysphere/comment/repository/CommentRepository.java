package com.nr.synergysphere.comment.repository;

import com.nr.synergysphere.comment.model.Comment;
import com.nr.synergysphere.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByTaskOrderByCreatedAtAsc(Task task);
}
