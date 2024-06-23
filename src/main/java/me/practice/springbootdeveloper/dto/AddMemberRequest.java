package me.practice.springbootdeveloper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.practice.springbootdeveloper.domain.Member;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddMemberRequest {
    private String email;
    private String pw;
    private String name;

    public Member toEntity(){
        return Member.builder()
                .email(email)
                .pw(pw)
                .name(name)
                .build();
    }
}
