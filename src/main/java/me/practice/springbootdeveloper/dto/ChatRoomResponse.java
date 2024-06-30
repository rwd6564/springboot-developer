package me.practice.springbootdeveloper.dto;

import lombok.Getter;
import me.practice.springbootdeveloper.domain.Chatroom;

@Getter
public class ChatRoomResponse {

    private final Long id;
    private final String user1;
    private final String user2;


    public ChatRoomResponse(Chatroom chatRoom) {
        this.id = chatRoom.getId();
        this.user1 = chatRoom.getUser1();
        this.user2 = chatRoom.getUser2();
    }
}
