package com.nr.synergysphere.user.dto;

import com.nr.synergysphere.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private UUID id;
    private String name;
    private String email;
    private String profileImage;
    private String bio;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}