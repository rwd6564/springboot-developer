package me.practice.springbootdeveloper.repository;

import me.practice.springbootdeveloper.domain.Chatmessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<Chatmessage, Long> {
    List<Chatmessage> findByRoom(long room);
}
