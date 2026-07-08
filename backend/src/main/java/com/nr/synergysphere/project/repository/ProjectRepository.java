package com.nr.synergysphere.project.repository;

import com.nr.synergysphere.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
