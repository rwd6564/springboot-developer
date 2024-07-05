package me.practice.springbootdeveloper.dto;

import lombok.Getter;
import me.practice.springbootdeveloper.domain.Chatmessage;
import me.practice.springbootdeveloper.domain.Member;

@Getter
public class ChatListResponse {

    private final Long id;
    private final Long room;
    private final String name;
    private final String email;
    private final String message;
    private final String sysdate;

    public ChatListResponse(Chatmessage chatmessage, Member member) {
        this.id = chatmessage.getId();
        this.room = chatmessage.getRoom();
        this.email = member.getEmail();
        this.name = member.getName();
        this.message = chatmessage.getMessage();
        this.sysdate = chatmessage.getSysdate();
    }
}
