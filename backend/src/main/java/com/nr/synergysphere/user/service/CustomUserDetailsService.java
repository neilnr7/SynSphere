package com.nr.synergysphere.user.service;

import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
//from spring sec all
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

//Spring Security needs a way to load user from DB
//Spring doesn’t know your DB structure, so you implement UserDetailsService to bridge that gap
@Service
//Marks this as a Spring-managed bean.
//Spring will automatically create and inject it where needed.
@RequiredArgsConstructor
//From Lombok.
//Automatically creates a constructor for final fields.
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    //UserDetails and UsernameNotFound is a class in spring security
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User Not Found"));


        //Spring Security does NOT understand your custom User class
        //So you convert it into a Spring Security User object.
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(user.getRole().name())))
                .build();
        //.getRole() gives enum object but SimpleGrantedAuthority requires String so .name() converts enum to string

    }

}
