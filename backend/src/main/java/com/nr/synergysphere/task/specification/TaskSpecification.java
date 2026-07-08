package com.nr.synergysphere.task.specification;

import com.nr.synergysphere.task.model.Task;
import com.nr.synergysphere.task.model.TaskStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.*;
import jakarta.persistence.criteria.Predicate;
public class TaskSpecification {
    public static Specification<Task>
    filterTasks(
            UUID projectId,
            TaskStatus status,
            UUID assignedTo,
            String search
    ){

        return (root,query,cb)->{

            List<Predicate> predicates =
                    new ArrayList<>();

            predicates.add(
                    cb.equal(
                            root.get("project")
                                    .get("id"),
                            projectId
                    )
            );

            if(status!=null){

                predicates.add(
                        cb.equal(
                                root.get("status"),
                                status
                        )
                );

            }

            if(assignedTo!=null){

                predicates.add(
                        cb.equal(
                                root.get("assignedTo")
                                        .get("id"),
                                assignedTo
                        )
                );

            }

            if(search!=null &&
                    !search.isBlank()){

                predicates.add(

                        cb.like(
                                cb.lower(
                                        root.get("title")
                                ),
                                "%"
                                        +search.toLowerCase()
                                        +"%"
                        )
                );

            }

            return cb.and(
                    predicates.toArray(
                            new Predicate[0]
                    )
            );

        };

    }
}
