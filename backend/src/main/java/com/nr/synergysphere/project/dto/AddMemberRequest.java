package com.nr.synergysphere.project.dto;

import com.nr.synergysphere.common.enums.ProjectRole;
import lombok.Data;

import java.util.UUID;

@Data
public class AddMemberRequest {
    private String userEmail;
    private ProjectRole role;
}
