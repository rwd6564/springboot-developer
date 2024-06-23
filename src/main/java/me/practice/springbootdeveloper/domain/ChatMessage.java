package me.practice.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;



@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage {

    private Long id;
    private String from;
    private String to;
    private String message;


    public ChatMessage(Long id, String from, String to, String message) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.message = message;
    }
}
