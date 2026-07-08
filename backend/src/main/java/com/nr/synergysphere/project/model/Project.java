package com.nr.synergysphere.project.model;

import com.nr.synergysphere.common.enums.Priority;
import com.nr.synergysphere.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity //Marks the class as a db table
@NoArgsConstructor  //from lombok generates a default constructor
@AllArgsConstructor //generate a constructor with all fields as parameters
@Data   //automatically generates getters,setters
@Builder //Implements builder design patter
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")  //stored as text in db (no length limit, allows for long descriptions)
    private String description;

    @ManyToOne  //Many projects, one user. meaning 2 or more projects are created by one user
    @JoinColumn(name = "created_by") //foreign key
    private User createdBy;

    @ManyToOne
    @JoinColumn(name="project_manager_id")
    private User projectManager;

    private LocalDateTime deadline;//date + time

    @Enumerated(EnumType.STRING)//stores enums as a string in db otherwise by default they are stored as numbers(ORDINAL)
    private Priority priority;      //IF YOU STORE AS ORDINAL THE ORDER MAY CHANGE IF YOU CHANGE ENUM ORDER

    @ElementCollection  //postgresql TEXT[]
    //jpa creates a seperate table automatically
    private List<String> tags;

    private String imageUrl;

    private Integer taskCount = 0;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;



}
