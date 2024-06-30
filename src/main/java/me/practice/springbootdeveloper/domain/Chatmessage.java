package me.practice.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;




@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatmessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;
    @Column(name = "room", nullable = false)
    private Long room;
    @Column(name = "fromuser", nullable = false)
    private String fromuser;
    @Column(name = "touser", nullable = false)
    private String touser;
    @Column(name = "message", nullable = false)
    private String message;
    @Column(name = "sysdate", nullable = false)
    private String sysdate;


    @Builder
    public Chatmessage(Long id, Long room, String fromuser, String touser, String message, String sysdate) {
        this.id = id;
        this.room = room;
        this.fromuser = fromuser;
        this.touser = touser;
        this.message = message;
        this.sysdate = sysdate;
    }
}
