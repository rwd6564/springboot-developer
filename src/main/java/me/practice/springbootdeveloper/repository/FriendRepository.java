package me.practice.springbootdeveloper.repository;

import me.practice.springbootdeveloper.domain.Friend;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByMemEmail(String MemEmail);
}
