package me.practice.springbootdeveloper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.practice.springbootdeveloper.domain.Chatmessage;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddChatmessageRequest {

    private Long room;
    private String fromuser;
    private String touser;
    private String message;
    private String sysdate;

    public Chatmessage toEntity(){
        return Chatmessage.builder()
                .room(room)
                .fromuser(fromuser)
                .touser(touser)
                .message(message)
                .sysdate(sysdate)
                .build();
    }
}
