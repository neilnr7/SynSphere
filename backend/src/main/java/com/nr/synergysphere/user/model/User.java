package com.nr.synergysphere.user.model;

import com.nr.synergysphere.common.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)// identity mean auto increment
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    @Column(unique = true,nullable = false)
    private String email;

    @Column(name = "password_hash",nullable = false)
    private String password;

    @Column(name = "profile_image")
    private String profileImage;

    private String bio;

    @Column(name = "global_role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;



}
