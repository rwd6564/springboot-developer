package me.practice.springbootdeveloper.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import me.practice.springbootdeveloper.domain.Member;
import java.util.Optional;



public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmailAndPw(String email, String pw);

}

