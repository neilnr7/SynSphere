package com.nr.synergysphere.auth.service;

import com.nr.synergysphere.auth.dto.AuthResponse;
import com.nr.synergysphere.auth.dto.LoginRequest;
import com.nr.synergysphere.auth.dto.RegisterRequest;
import com.nr.synergysphere.auth.jwt.JwtService;
import com.nr.synergysphere.common.enums.Role;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    public AuthResponse register(RegisterRequest request){
        //without dto we would have directly take User here use AuthResp and Regreq dto

        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("User already exists");
        }

        User user = User.builder()  //convert dto to entity
                .name(request.getName())    //taking input from RegisteReq and creating a user entity
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();



        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()   //sends token back to client
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword()))
            throw new RuntimeException("Invalid Password");
        //request password = plain text
        //DB password = encrypted

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .build();

    }
}
