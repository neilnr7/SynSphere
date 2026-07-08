package com.nr.synergysphere.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;

    //DTO's are used to not expose entities directly
}
