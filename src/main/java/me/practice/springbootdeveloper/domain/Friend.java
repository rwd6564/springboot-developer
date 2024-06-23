package me.practice.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "memEmail", nullable = false)
    private String memEmail;

    @Column(name = "friEmail", nullable = false)
    private String friEmail;

//    @Column(name = "name", nullable = false)
//    private String name;
//
    @Builder
    public Friend(Long id, String memEmail, String friEmail) {
        this.id = id;
        this.memEmail = memEmail;
        this.friEmail = friEmail;

    }

//    public void update(String email, String pw) {
//        this.email = email;
//        this.pw = pw;
//    }
}
