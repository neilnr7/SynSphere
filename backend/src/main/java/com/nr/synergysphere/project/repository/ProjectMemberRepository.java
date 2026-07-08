package com.nr.synergysphere.project.repository;

import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.project.model.ProjectMember;
import com.nr.synergysphere.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {
    Optional<ProjectMember> findByProjectAndUser(Project project, User user);
    //SELECT *
    //FROM project_member
    //WHERE project_id = ? AND user_id = ?;
    //to check if user is already in project

    List<ProjectMember> findByUser(User user);
    //All projects that user is part of

    List<ProjectMember> findByProject(Project project);

    //analytics
    Long countByProject(Project project);


}
