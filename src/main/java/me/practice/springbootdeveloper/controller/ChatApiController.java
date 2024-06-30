package me.practice.springbootdeveloper.controller;

import lombok.RequiredArgsConstructor;
import me.practice.springbootdeveloper.domain.Chatmessage;
import me.practice.springbootdeveloper.domain.Chatroom;
import me.practice.springbootdeveloper.domain.Friend;
import me.practice.springbootdeveloper.domain.Member;
import me.practice.springbootdeveloper.dto.*;
import me.practice.springbootdeveloper.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class ChatApiController {

    private final ChatService chatService;
    private final SimpMessageSendingOperations template;


    //채팅방번호 없으면 등록하고 채팅방번호 반환
    @PostMapping("/talk")
    public long addChatroom(@RequestBody AddChatRoomRequest request) {
        System.out.println("받은 값" + request.getUser1() + request.getUser2());
        long cnt1 = -1;
        long cnt2 = -1;
        cnt1 = chatService.countByUser1AndUser2(request.getUser1(), request.getUser2());
        cnt2 = chatService.countByUser1AndUser2(request.getUser2(), request.getUser1());

        System.out.println("카운트 갯수: "+ cnt1 + ", " + cnt2);
        if (cnt1 == 0 && cnt2 == 0) {
            System.out.println("신규 채팅방");
            Chatroom savedChatRoom = chatService.save(request);
            return savedChatRoom.getId();
        } else {
            System.out.println("이미 채팅방번호가 있음");
            if (cnt1 == 1) {
                System.out.println("=============case1==============");
                Chatroom chatroom1 = chatService.findByUser1AndUser2(request.getUser1(), request.getUser2());

                return chatroom1.getId();
            } else {
                System.out.println("=============case2==============");
                Chatroom chatroom2 = chatService.findByUser1AndUser2(request.getUser2(), request.getUser1());
                return chatroom2.getId();
            }
        }
    }


    //메시지 처리
    @MessageMapping("/message/{room}")
    public ResponseEntity<Void> receiveMessage(@DestinationVariable("room") long room, @RequestBody Chatmessage chat, @RequestBody AddChatmessageRequest request ) {
        System.out.println(room + "===============messageMapping 실행됨==============");
        template.convertAndSend("/sub/chatroom/"+chat.getRoom(), chat);
        System.out.println("받은메시지:" + chat.getId() + chat.getRoom() + chat.getFromuser() +chat.getTouser() + chat.getMessage() + chat.getSysdate());
        chatService.save(request);
        return ResponseEntity.ok()
                .build();
    }


    //이전 대화내용 조회
    @GetMapping("/prevmessages/{room}")
    public ResponseEntity<List<ChatmessageResponse>> findPrevmessages(@PathVariable("room") long room) {
        System.out.println(room + "=============이전 대화내용 조회==============");
        List<ChatmessageResponse> prevMessages = chatService.findByRoom(room)
                .stream()
                .map(ChatmessageResponse::new)
                .toList();
        for (int i = 0; i<prevMessages.size(); i++) {
            System.out.println("!!!!!!!!!!이전대화내용" + prevMessages.get(i).getMessage());
        }
        return ResponseEntity.ok()
                .body(prevMessages);
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


    //친구목록 조회
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



//    @PutMapping("/api/articles/{id}")
//    public ResponseEntity<Article> updateArticle(@PathVariable long id,
//                                                 @RequestBody UpdateArticleRequest request) {
//        Article updateArticle = blogService.update(id, request);
//
//        return ResponseEntity.ok()
//                .body(updateArticle);
//    }

}



