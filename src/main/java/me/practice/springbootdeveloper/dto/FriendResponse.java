package me.practice.springbootdeveloper.dto;

import lombok.Getter;
import me.practice.springbootdeveloper.domain.Friend;

@Getter
public class FriendResponse {
    private final Long id;
    private final String memEmail;
    private final String friEmail;
//test
    public FriendResponse(Friend friend) {
        this.id = friend.getId();
        this.memEmail = friend.getMemEmail();
        this.friEmail = friend.getFriEmail();
    }
}
