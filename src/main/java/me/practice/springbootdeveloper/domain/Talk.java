package me.practice.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Talk {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "from", nullable = false)
    private String from;

    @Column(name = "to", nullable = false)
    private String to;

    @Column(name = "msg", nullable = false)
    private String msg;

    @Column(name = "sysdate", nullable = false)
    private String sysdate;

    @Builder
    public Talk(Long id, String from, String to, String msg, String sysdate) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.msg = msg;
        this.sysdate = sysdate;

    }
}
