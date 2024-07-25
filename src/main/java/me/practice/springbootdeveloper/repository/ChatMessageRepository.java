package me.practice.springbootdeveloper.repository;

import me.practice.springbootdeveloper.domain.Chatmessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<Chatmessage, Long> {
    List<Chatmessage> findByRoom(long room);

    @Query("SELECT DISTINCT c.room FROM Chatmessage c WHERE c.fromuser = :memEmail OR c.touser = :memEmail")
    List<String> findRoomsByUser(@Param("memEmail") String memEmail);

    @Query(value = "SELECT * FROM chatmessage WHERE room = :room AND id = (SELECT MAX(id)" +
            "FROM chatmessage WHERE room = :room)", nativeQuery = true)
    Chatmessage findLatestMessageByRoom(@Param("room") Long room);
}
