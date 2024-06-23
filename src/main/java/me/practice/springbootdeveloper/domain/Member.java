package me.practice.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "pw", nullable = false)
    private String pw;

    @Column(name = "name", nullable = false)
    private String name;

    @Builder
    public Member(String email, String pw, String name) {
        this.email = email;
        this.pw = pw;
        this.name = name;
    }

//    public void update(String email, String pw) {
//        this.email = email;
//        this.pw = pw;
//    }
}
