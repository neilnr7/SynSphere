package com.nr.synergysphere.project.dto;

import com.nr.synergysphere.common.enums.ProjectRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class MemberResponse {

    private UUID userId;

    private String name;

    private String email;

    private ProjectRole role;

    private LocalDateTime joinedAt;
}
