package me.practice.springbootdeveloper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.practice.springbootdeveloper.domain.Chatroom;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddChatRoomRequest {
    private String user1;
    private String user2;


    public Chatroom toEntity(){
        return Chatroom.builder()
                .user1(user1)
                .user2(user2)
                .build();
    }
}
