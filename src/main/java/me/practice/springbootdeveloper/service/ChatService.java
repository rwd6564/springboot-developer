package me.practice.springbootdeveloper.service;

import lombok.RequiredArgsConstructor;
import me.practice.springbootdeveloper.domain.Friend;
import me.practice.springbootdeveloper.domain.Member;
import me.practice.springbootdeveloper.dto.AddFriendRequest;
import me.practice.springbootdeveloper.dto.AddMemberRequest;
import me.practice.springbootdeveloper.repository.FriendRepository;
import me.practice.springbootdeveloper.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatService {
    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;

    //회원가입
    public Member save(AddMemberRequest request){
        return memberRepository.save(request.toEntity());
    }

    //친구추가
    public Friend save(AddFriendRequest request){
        return friendRepository.save(request.toEntity());
    }


    public List<Friend> findAll() {
        return friendRepository.findAll();
    }

    //친구목록조회
    public List<Friend> findByMemEmail(String memEmail) {
        return friendRepository.findByMemEmail(memEmail);
    }


    public Member findById(long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found: "+id));
    }

    public void delete(long id) {
        memberRepository.deleteById(id);
    }

    public Member findByEmailAndPw(String email, String pw) {
        return memberRepository.findByEmailAndPw(email, pw)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + email));
    }

//    @Transactional
//    public Article update(long id, UpdateArticleRequest request) {
//        Article article = blogRepository.findById(id)
//                .orElseThrow(() ->new IllegalArgumentException("not found: "+id));
//
//        article.update(request.getTitle(), request.getContent());
//
//        return article;
//    }

}
