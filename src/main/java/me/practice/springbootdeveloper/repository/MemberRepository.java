package me.practice.springbootdeveloper.repository;

import me.practice.springbootdeveloper.dto.MemberFriendDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import me.practice.springbootdeveloper.domain.Member;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;



public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmailAndPw(String email, String pw);
    Optional<Member> findByEmail(String email);
    long countByEmail(String email);

    @Query("SELECT new me.practice.springbootdeveloper.dto.MemberFriendDTO(m.email, m.name) " +
            "FROM Member m JOIN Friend f ON f.friEmail = m.email " +
            "WHERE f.memEmail = :memEmail")
    List<MemberFriendDTO> findMemberFriend(@Param("memEmail") String memEmail);
}

