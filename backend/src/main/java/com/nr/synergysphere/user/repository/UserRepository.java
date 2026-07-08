package com.nr.synergysphere.user.repository;

import com.nr.synergysphere.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {//<Entity class, Type of primary key>

    Optional<User> findByEmail(String email);//optional may or may not contain value, without it if no user it returns null(nullptrexception)
    //boolean existsByEmail(String email);
}
