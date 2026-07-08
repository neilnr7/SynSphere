package com.nr.synergysphere.project.model;

import com.nr.synergysphere.common.enums.ProjectRole;
import com.nr.synergysphere.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "project_member",uniqueConstraints = @UniqueConstraint(columnNames = {"project_id","user_id"}))
//enforces constraint that combination of project id and user id must be UNIQUE
//the same user should not join the same project twice
public class ProjectMember {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    //Many project members rows point to one project

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    //same user in many rows

    //Each ProjectMember row belongs to ONE project and ONE user, but a project or user can appear in many rows.

    @Enumerated(EnumType.STRING)
    private ProjectRole role;

    private LocalDateTime joinedAt;
}
