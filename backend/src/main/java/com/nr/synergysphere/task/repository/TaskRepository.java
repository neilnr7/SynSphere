package com.nr.synergysphere.task.repository;

import com.nr.synergysphere.project.model.Project;
import com.nr.synergysphere.task.model.Task;
import com.nr.synergysphere.task.model.TaskPriority;
import com.nr.synergysphere.task.model.TaskStatus;
import com.nr.synergysphere.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {
    List<Task> findByProject(Project project);


    //analytics methods
    Long countByProject(Project project);

    Long countByProjectAndStatus(Project project, TaskStatus status);

    Long countByProjectAndPriority(Project project, TaskPriority priority);

    Long countByProjectAndAssignedTo(Project project, User assignedTo);

    Long countByProjectAndAssignedToAndStatus(Project project, User assignedTo, TaskStatus status);
}

//JpaSpecificationExecutor
//lets us create dynamic filters like:
//status only
//assigned user only
//search only
//all together
//without writing 20 query methods.