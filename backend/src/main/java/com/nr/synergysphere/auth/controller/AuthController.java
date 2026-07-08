package com.nr.synergysphere.auth.controller;

import com.nr.synergysphere.auth.dto.AuthResponse;
import com.nr.synergysphere.auth.dto.LoginRequest;
import com.nr.synergysphere.auth.dto.RegisterRequest;
import com.nr.synergysphere.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }



}
