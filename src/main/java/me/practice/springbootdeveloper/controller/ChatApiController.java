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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;


@RestController
@RequiredArgsConstructor
public class ChatApiController {

    private final ChatService chatService;
    private final SimpMessageSendingOperations template;
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatApiController.class);

    //채팅방번호 없으면 -> 등록하고 채팅방번호만 return / 있으면 이전대화내용 return
    @PostMapping("/talk")
    public ResponseEntity<List<ChatmessageResponse>> addChatroom(@RequestBody AddChatRoomRequest request) {
        LOGGER.info("=============채팅방번호, 이전대화내용 조회==============");
        LOGGER.info("받은 값: {}", request.getUser1() + ", " + request.getUser2());
        long cnt1 = -1;
        long cnt2 = -1;
        cnt1 = chatService.countByUser1AndUser2(request.getUser1(), request.getUser2());
        cnt2 = chatService.countByUser1AndUser2(request.getUser2(), request.getUser1());
        long room = -1;
        LOGGER.info("카운트 갯수: {}", cnt1 + ", " + cnt2);

        if (cnt1 == 0 && cnt2 == 0) {
            LOGGER.info("=============신규 채팅방==============");
            Chatroom savedChatRoom = chatService.save(request);
            room = savedChatRoom.getId();

        } else {
            LOGGER.info("=============이미 채팅방번호가 있음==============");
            if (cnt1 == 1) {
                LOGGER.info("=============case1==============");
                Chatroom chatroom1 = chatService.findByUser1AndUser2(request.getUser1(), request.getUser2());
                room = chatroom1.getId();
            } else {
                LOGGER.info("=============case2==============");
                Chatroom chatroom2 = chatService.findByUser1AndUser2(request.getUser2(), request.getUser1());
                room = chatroom2.getId();
            }
        }

        LOGGER.info("++++++++++++++++++++++++++++++");
        LOGGER.info("room값: {}", room);
        LOGGER.info("결과값: {}", findPrevmessages(room).getBody());
        LOGGER.info("++++++++++++++++++++++++++++++");
        return findPrevmessages(room);
    }


    //메시지 처리
    @MessageMapping("/message/{room}")
    public ResponseEntity<Void> receiveMessage(@DestinationVariable("room") long room, @RequestBody Chatmessage chat, @RequestBody AddChatmessageRequest request ) {
        LOGGER.info(room + "===============messageMapping 실행됨==============");
        template.convertAndSend("/sub/chatroom/"+chat.getRoom(), chat);
        LOGGER.info("받은메시지:" + chat.getId() + chat.getRoom() + chat.getFromuser() +chat.getTouser() + chat.getMessage() + chat.getSysdate());
        chatService.save(request);

        return ResponseEntity.ok()
                .build();
    }


    //채팅방번호로 이전 대화내용 조회
    public ResponseEntity<List<ChatmessageResponse>> findPrevmessages(long room) {
        LOGGER.info("=============이전 대화내용 조회==============");
        List<ChatmessageResponse> prevMessages = chatService.findByRoom(room)
                .stream()
                .map(ChatmessageResponse::new)
                .toList();

        //이전대화내용이 없는 경우
        if (prevMessages.isEmpty()) {
            //채팅방번호 이외 임의값 설정
            Chatmessage test1 = new Chatmessage(-1L, room, "test1", "test2", "test3", "0000");
            ChatmessageResponse test2 = new ChatmessageResponse(test1);
            List<ChatmessageResponse> temp = new ArrayList<>(1);
            temp.add(test2);
            return ResponseEntity.ok()
                    .body(temp);
        //이전대화내용이 있는 경우
        }else {
            return ResponseEntity.ok()
                    .body(prevMessages);
        }
    }


    //이메일, 비밀번호로 회원조회해서 일치하면 로그인
    @GetMapping("/home/login")
    public ResponseEntity<MemberResponse> login(@RequestParam("email") String email, @RequestParam("pw") String pw){
        LOGGER.info("=============로그인요청==============");
        LOGGER.info("수신된 email, pw: {}", email + ", " + pw);
        Member member = chatService.findByEmailAndPw(email, pw);
        LOGGER.info("회원조회결과 : {}", member.getEmail() + ", " + member.getPw() + ", " + member.getName());
        return ResponseEntity.ok()
                .body(new MemberResponse(member));
    }



    @GetMapping("/join")
    public String test2() {
        return "회원가입창테스트";
    }


    //친구목록 조회
    @GetMapping("/api/main/friends")
    public ResponseEntity<List<MemberResponse>> findFriends(@RequestParam("memEmail") String memEmail) {
        LOGGER.info("=============친구목록 조회==============");
        LOGGER.info("수신된 memEmail: {}", memEmail);
        List<MemberResponse> friends = chatService.getMemberFriendDTOs(memEmail)
                .stream()
                .map(MemberResponse::new)
                .toList();
        for (int i = 0; i < friends.size(); i++) {
            LOGGER.info("friend" +i +": {}", friends.get(i).getEmail() +", " + friends.get(i).getName());
        }
        return ResponseEntity.ok()
                .body(friends);
    }


    //대화한적있는 채팅방목록 return
    @GetMapping("/api/main/chatlist")
    public ResponseEntity<List<ChatListResponse>> findChatlist(@RequestParam("memEmail") String memEmail) {
        LOGGER.info("=============채팅목록조회테스트==============");
        LOGGER.info("수신된 memEmail: {}", memEmail);
        List<String> temp = chatService.getRoomsByUser(memEmail);
        List<ChatListResponse> chatLists = new ArrayList<>();
        for (String s : temp) {
            long room = Long.parseLong(s);
            chatLists.add(chatService.getLatestMessageByRoom(room, memEmail));
        }
        chatLists.sort((o1, o2) -> o2.getSysdate().compareTo(o1.getSysdate()));
        for (int i=0; i<chatLists.size(); i++) {
            LOGGER.info("chat" + i + ": {}", chatLists.get(i).getRoom() + chatLists.get(i).getName()+ chatLists.get(i).getMessage() + chatLists.get(i).getSysdate());
        }
        return ResponseEntity.ok()
                .body(chatLists);
    }


    //id로 회원조회
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
        LOGGER.info("===========회원가입요청=============");
        Member savedMember = chatService.save(request);
        LOGGER.info("이메일:" + savedMember.getEmail());
        LOGGER.info("pw:" +savedMember.getPw());
        LOGGER.info("이름:" +savedMember.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedMember);
    }


    //친구추가
    @PostMapping("/main/addfriend")
    public ResponseEntity<Friend> addFriend(@RequestBody AddFriendRequest request) {
        LOGGER.info("===========친구추가요청=============");
        long cnt = -1;
        cnt = countByEmail(request.getFriEmail());
        LOGGER.info("===========cnt값: " + cnt);
        if (cnt == 0) {
            Friend savedFriend = new Friend(-1L, "temp", "temp");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(savedFriend);
        } else {
            Friend savedFriend = chatService.save(request);
            LOGGER.info("내이메일:" + savedFriend.getMemEmail());
            LOGGER.info("친구이메일:" +savedFriend.getFriEmail());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(savedFriend);
        }
    }


    //email로 회원목록에 있는지 조회
    public long countByEmail(@RequestParam("email") String email) {
        long cnt = -1;
        cnt = chatService.countByEmail(email);
        return cnt;
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



