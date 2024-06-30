package me.practice.springbootdeveloper.domain;

import com.fasterxml.jackson.datatype.jsr310.util.DurationUnitConverter;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "user1", nullable = false)
    private String user1;

    @Column(name = "user2", nullable = false)
    private String user2;



    @Builder
    public Chatroom(Long id, String user1, String user2) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;

    }


}
