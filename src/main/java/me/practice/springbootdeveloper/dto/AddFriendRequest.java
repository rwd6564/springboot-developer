package me.practice.springbootdeveloper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.practice.springbootdeveloper.domain.Friend;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddFriendRequest {

    private String memEmail;
    private String friEmail;


    public Friend toEntity(){
        return Friend.builder()
                .memEmail(memEmail)
                .friEmail(friEmail)
                .build();
    }
}
