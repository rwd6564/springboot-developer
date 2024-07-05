package me.practice.springbootdeveloper.dto;

import lombok.Getter;

@Getter
public class MemberFriendDTO {
    // Getters and setters
    private String email;
    private String name;

    public MemberFriendDTO(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }
}
