package com.nr.synergysphere.user.service;

import com.nr.synergysphere.user.dto.ChangePasswordRequest;
import com.nr.synergysphere.user.dto.ChangePasswordResponse;
import com.nr.synergysphere.user.dto.UpdateUserProfileRequest;
import com.nr.synergysphere.user.dto.UserProfileResponse;
import com.nr.synergysphere.user.model.User;
import com.nr.synergysphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getCurrentUserProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToProfileResponse(user);
    }

    public UserProfileResponse updateCurrentUserProfile(
            UpdateUserProfileRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);

        return mapToProfileResponse(updatedUser);
    }

    public ChangePasswordResponse changePassword(
            ChangePasswordRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().length() < 6) {
            throw new RuntimeException(
                    "New password must be at least 6 characters"
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ChangePasswordResponse.builder()
                .message("Password changed successfully")
                .build();
    }

    private UserProfileResponse mapToProfileResponse(User user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}