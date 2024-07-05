package me.practice.springbootdeveloper.dto;

import lombok.Getter;
import me.practice.springbootdeveloper.domain.Member;

@Getter
public class MemberResponse {
    private final String email;
    private final String pw;
    private final String name;

    public MemberResponse(Member member) {
        this.email = member.getEmail();
        this.pw = member.getPw();
        this.name = member.getName();
    }

    public MemberResponse(MemberFriendDTO dto) {

        this.email = dto.getEmail();
        this.pw = "";
        this.name = dto.getName();
    }

}
