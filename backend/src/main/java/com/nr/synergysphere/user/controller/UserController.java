package com.nr.synergysphere.user.controller;

import com.nr.synergysphere.user.dto.ChangePasswordRequest;
import com.nr.synergysphere.user.dto.ChangePasswordResponse;
import com.nr.synergysphere.user.dto.UpdateUserProfileRequest;
import com.nr.synergysphere.user.dto.UserProfileResponse;
import com.nr.synergysphere.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public UserProfileResponse getCurrentUserProfile(
            Authentication authentication
    ) {

        return userService.getCurrentUserProfile(
                authentication.getName()
        );
    }

    @PutMapping("/profile")
    public UserProfileResponse updateCurrentUserProfile(
            @RequestBody UpdateUserProfileRequest request,
            Authentication authentication
    ) {

        return userService.updateCurrentUserProfile(
                request,
                authentication.getName()
        );
    }

    @PutMapping("/password")
    public ChangePasswordResponse changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {

        return userService.changePassword(
                request,
                authentication.getName()
        );
    }
}