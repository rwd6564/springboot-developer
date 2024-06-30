package me.practice.springbootdeveloper.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import me.practice.springbootdeveloper.domain.Chatmessage;

@Getter
public class ChatmessageResponse {

    private final Long id;
    private final Long room;
    private final String fromuser;
    private final String touser;
    private final String message;
    private final String sysdate;


    public ChatmessageResponse(Chatmessage chatmessage) {
        this.id = chatmessage.getId();
        this.room = chatmessage.getRoom();
        this.fromuser = chatmessage.getFromuser();
        this.touser = chatmessage.getTouser();
        this.message = chatmessage.getMessage();
        this.sysdate = chatmessage.getSysdate();
    }
}
