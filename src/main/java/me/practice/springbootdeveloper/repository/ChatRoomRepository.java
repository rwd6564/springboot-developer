package me.practice.springbootdeveloper.repository;

import me.practice.springbootdeveloper.domain.Chatroom;
import me.practice.springbootdeveloper.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<Chatroom, Long> {

    Long countByUser1AndUser2(String user1, String user2);
    Long countByUser2AndUser1(String user2, String user1);
    Optional<Chatroom> findByUser1AndUser2(String user1, String user2);
    Optional<Chatroom> findByUser2AndUser1(String user2, String user1);
}
