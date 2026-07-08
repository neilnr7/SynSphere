package com.nr.synergysphere.project.dto;

import com.nr.synergysphere.common.enums.Priority;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
//Retrieve data from client into backend
@Data
public class CreateProjectRequest {
    private String name;
    private String description;
    private LocalDateTime deadline;
    private Priority priority;
    private List<String> tags;
    private String imageUrl;
}
//DTOs are used to transfer data from client to server without exposing internal entity structure.