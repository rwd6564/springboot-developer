package me.practice.springbootdeveloper.controller;

import lombok.RequiredArgsConstructor;
import me.practice.springbootdeveloper.domain.ChatMessage;
import me.practice.springbootdeveloper.domain.Friend;
import me.practice.springbootdeveloper.domain.Member;
import me.practice.springbootdeveloper.dto.*;
import me.practice.springbootdeveloper.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class ChatApiController {


    private final ChatService chatService;
    private final SimpMessageSendingOperations template;

    @GetMapping("/main/{id}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable("id") Long id) {
        System.out.println("+++++++++++실행됨++++++++" + id);
        ChatMessage test = new ChatMessage(1L, "test1", "", "");
        return ResponseEntity.ok().body(List.of(test));
    }

    @MessageMapping("/message")
    public ResponseEntity<Void> receiveMessage(@RequestBody ChatMessage chat) {
        System.out.println("===============messageMapping 실행됨==============");
        template.convertAndSend("/sub/chatroom/1", chat);
        System.out.println("확인용:" + chat.getId() + chat.getFrom() +chat.getTo() + chat.getMessage());
        return ResponseEntity.ok().build();
    }


    //이메일, 비밀번호로 회원조회
    @GetMapping("/home/login")
    public ResponseEntity<MemberResponse> login(@RequestParam("email") String email, @RequestParam("pw") String pw){
        System.out.println("=============로그인요청==============");
        System.out.println("이메일: " + email);
        System.out.println("비밀번호: " + pw);
        Member member = chatService.findByEmailAndPw(email, pw);
        System.out.println(member.getEmail());
        System.out.println(member.getPw());
        System.out.println(member.getName());
        return ResponseEntity.ok()
                .body(new MemberResponse(member));
    }

    @GetMapping("/join")
    public String test2() {
        return "회원가입창테스트";
    }


//    @GetMapping("/main")
//    public String hello() {
//        System.out.println("=============Main 실행됨==============");
//        return "반환값테스트";
//    }



    @GetMapping("/api/main/friends")
    public ResponseEntity<List<FriendResponse>> findFriends(@RequestParam("memEmail") String memEmail) {
        System.out.println("=============친구목록 조회==============");
        List<FriendResponse> friends = chatService.findByMemEmail(memEmail)
                .stream()
                .map(FriendResponse::new)
                .toList();
        return ResponseEntity.ok()
                .body(friends);
    }

    @GetMapping("/api/members/{id}")
    public ResponseEntity<MemberResponse> findMemberId(@PathVariable long id) {
        Member member = chatService.findById(id);

        return ResponseEntity.ok()
                .body(new MemberResponse(member));
    }

    //이메일로 비밀번호 검색
    @GetMapping("/api/members/{email}")
    public ResponseEntity<MemberResponse> findMemberEmail(@PathVariable String email, String pw) {
        Member member = chatService.findByEmailAndPw(email, pw);

        return ResponseEntity.ok()
                .body(new MemberResponse(member));
    }


    //회원가입
    @PostMapping("/join/member")
    public ResponseEntity<Member> addMember(@RequestBody AddMemberRequest request) {
        System.out.println("===========회원가입요청=============");
        Member savedMember = chatService.save(request);
        System.out.println("이메일:" + savedMember.getEmail());
        System.out.println("pw:" +savedMember.getPw());
        System.out.println("이름:" +savedMember.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedMember);
    }

    //친구추가
    @PostMapping("/main/addfriend")
    public ResponseEntity<Friend> addFriend(@RequestBody AddFriendRequest request) {
        System.out.println("===========친구추가요청=============");
        Friend savedFriend = chatService.save(request);
        System.out.println("내이메일:" + savedFriend.getMemEmail());
        System.out.println("친구이메일:" +savedFriend.getFriEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedFriend);
    }



    @DeleteMapping("/api/articles/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable long id) {
        chatService.delete(id);

        return ResponseEntity.ok()
                .build();
    }

//    @PutMapping("/api/articles/{id}")
//    public ResponseEntity<Article> updateArticle(@PathVariable long id,
//                                                 @RequestBody UpdateArticleRequest request) {
//        Article updateArticle = blogService.update(id, request);
//
//        return ResponseEntity.ok()
//                .body(updateArticle);
//    }

}



