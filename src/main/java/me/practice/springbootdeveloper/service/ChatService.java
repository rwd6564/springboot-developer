package me.practice.springbootdeveloper.service;

import lombok.RequiredArgsConstructor;
import me.practice.springbootdeveloper.domain.Chatmessage;
import me.practice.springbootdeveloper.domain.Chatroom;
import me.practice.springbootdeveloper.domain.Friend;
import me.practice.springbootdeveloper.domain.Member;
import me.practice.springbootdeveloper.dto.AddChatRoomRequest;
import me.practice.springbootdeveloper.dto.AddChatmessageRequest;
import me.practice.springbootdeveloper.dto.AddFriendRequest;
import me.practice.springbootdeveloper.dto.AddMemberRequest;
import me.practice.springbootdeveloper.repository.ChatMessageRepository;
import me.practice.springbootdeveloper.repository.ChatRoomRepository;
import me.practice.springbootdeveloper.repository.FriendRepository;
import me.practice.springbootdeveloper.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatService {
    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    //회원가입
    public Member save(AddMemberRequest request){
        return memberRepository.save(request.toEntity());
    }

    //친구추가
    public Friend save(AddFriendRequest request){
        return friendRepository.save(request.toEntity());
    }

    //채팅방추가
    public Chatroom save(AddChatRoomRequest request){
        return chatRoomRepository.save(request.toEntity());
    }
    //채팅추가
    public Chatmessage save(AddChatmessageRequest request){
        return chatMessageRepository.save(request.toEntity());
    }


    public long countByUser1AndUser2(String user1, String user2) {
        return chatRoomRepository.countByUser1AndUser2(user1, user2);
    }

    public List<Friend> findAll() {
        return friendRepository.findAll();
    }

    //친구목록 조회
    public List<Friend> findByMemEmail(String memEmail) {
        return friendRepository.findByMemEmail(memEmail);
    }

    //이전 대화내용 조회
    public List<Chatmessage> findByRoom(long room) {
        return chatMessageRepository.findByRoom(room);
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


    public Chatroom findByUser1AndUser2(String user1, String user2) {
        System.out.println("user1, user2로 조회.......");
        System.out.println(chatRoomRepository.findByUser1AndUser2(user1, user2).isEmpty());
        return chatRoomRepository.findByUser1AndUser2(user1, user2)
                .orElseThrow(() -> new IllegalArgumentException("not found: "+user1 + user2));

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
