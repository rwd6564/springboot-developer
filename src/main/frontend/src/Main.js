import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import edit1 from './image/edit1.png';
import edit2 from './image/edit2.png';
import edit3 from './image/edit3.png';
import edit4 from './image/edit4.png';
import edit5 from './image/edit5.png';
import add1 from './image/add1.png';
import add2 from './image/add2.png';
import chaticon from './image/chaticon.png';
import down from './image/down.png';
import profile from './image/profile.png';
import { Stomp } from "@stomp/stompjs";
import { io } from "socket.io-client";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Swal from "sweetalert2";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Avatar,
    ExpansionPanel,
    ConversationHeader,
    ConversationList,
    Conversation,
    Sidebar,
    Search,
} from "@chatscope/chat-ui-kit-react";


function Main() {

    const stompClient = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [email, setEmail] = useState();
    const location = useLocation();
    const memberInfo = { ...location.state };
    const [memEmail, setMemEmail] = useState("");
    const [friEmail, setFriEmail] = useState("");
    const [data, setData] = useState([]);
    const [chatData, setChatData] = useState([]);
    const [messages, setMessages] = new useState([]);
    const [to, setTo] = useState("");
    const [toname, setToname] = useState("");
    const [room, setRoom] = useState();
    const [prev, setPrev] = useState([]);
    const [temp, setTemp] = useState([]);
    var selected = ""


    //웹소켓 연결
    const connect = () => {
        console.log("==============connect=================", room)
        const socket = new WebSocket("ws://localhost:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/sub/chatroom/` + room, (message) => {
                console.log("******************************" + message.body);
                const newMessage = JSON.parse(message.body);
                console.log("뉴메시지확인로그:" + newMessage)
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        });
    };


    //웹소켓 연결해제
    const disconnect = () => {
        console.log("==============disconnect=================")
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
    };


    //페이지 로드될때마다 실행
    useEffect(() => {
        connect();

        return () => disconnect();
    });


    //페이지 로드 후 1회 실행
    useEffect(() => {
    getFriendList(memberInfo);
    getChatList(memberInfo);
    }, []);




    //FIXME
    // 안씀. 나중에 삭제
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    //친구목록 불러오기
    const getFriendList = (memberInfo) => {
        axios.get('/api/main/friends', {
            params: {
                memEmail: memberInfo.email
            }
        })
            .then(response => { console.log(response.data); setData(response.data) })
            .catch(function () {
                console.log('친구목록 불러오기 실패')
            })
    }

    //대화한적있는 채팅방목록 불러오기
    const getChatList = (memberInfo) => {
        axios.get('/api/main/chatlist', {
            params: {
                memEmail: memberInfo.email
            }
        })
            .then(console.log("========채팅방목록 응답데이터"))
            .then(response => { console.log(response.data); setChatData(response.data)})
            .then(console.log("채팅방목록 응답데이터========"))
            .catch(function () {
                console.log('채팅목록 불러오기 실패')
            })
    }


    //친구추가
    const postNewFriend = (memberInfo, friEmail) => {
        axios.post('/main/addfriend', {
            memEmail: memberInfo.email,
            friEmail: friEmail
        })
            .then(response => { console.log(response.data);
                                Swal.fire({
                                            text: '친구등록 완료',
                                            confirmButtonText: '확인',
                                           })
                              })
            .catch(function () {
                Swal.fire({
                            icon: 'warning',
                            title: '',
                            text: '사용자가 존재하지 않거나 이미 친구로 등록되었습니다.',
                            confirmButtonText: '확인',
                           })
                console.log('친구추가 실패')
            });
            getFriendList(memberInfo);
    }


    //현재시간 가져오기
    const currentTime = () => {
        let time = ""
        const date = new Date();
        const year = String(date.getFullYear()).padStart(4, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        time = (`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
        return time;
    }


    //메시지 전송 버튼 눌렀을때
    const handleSend = (input) => {
        console.log("==============send시작=================")
        let newMessage = {
            model: {
                message: input,
                direction: "outgoing",
            },
        };
        if (stompClient.current && input) {
            const body = {
                id: 1,
                room: room,
                fromuser: memberInfo.email,
                touser: to,
                message: input,
                sysdate: currentTime(),
            };
            stompClient.current.send(`/pub/message/` + room, {},
                JSON.stringify(body));
        }
        getChatList(memberInfo);
    };


    //토글버튼 함수
    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!'),
        );
        return (
            <button
                type="button"
                style={{ backgroundColor: '', border: 'white' }}
                onClick={decoratedOnClick}
            >{children}
            </button>
        );
    }

    //채팅방번호 및 이전채팅 가져오기
    const abc = (my_friends) => {
        axios.post('/talk', {
            user1: memberInfo.email,
            user2: my_friends.email
        })
            .then(response => { console.log(response.data); setRoom(response.data[0].room);setPrev(response.data);setMessages([])})
            .catch(function () {
                console.log('talk실행 실패')
            });
    }


    //로그인 된 경우 메인화면 렌더링
    if (memberInfo.email != null) {
        return (
            <div
            style={{
                    height: "600px",
                    position: "relative"
                  }}

            >
                <>
                    <Navbar className="bg-body-tertiary">
                        <Navbar.Brand href="#main">
                            MONCHAT
                        </Navbar.Brand>
                    </Navbar>
                </>
    <MainContainer responsive>
    <Sidebar position="left">
          <ExpansionPanel title="내 프로필">
             <li className="list-group-item nanumR">
                <div className="CenterAlign  "><img className="profile" src={profile} alt="" /></div>
                {memberInfo.name}<img className="icon" src={edit5} alt="" /><br />{memberInfo.email}
            </li>
          </ExpansionPanel>
          <ExpansionPanel title="친구추가">
         <div className="input-group mb-3">
             <input onChange={(e) => {
                 setFriEmail(e.target.value);
             }} type="text" className="form-control nanumR" placeholder="이메일 입력"
                 aria-label="Recipient's username" aria-describedby="button-addon2"></input>
             <button onClick={
                 () => {
                     //친구추가요청
                     postNewFriend(memberInfo, friEmail);
                     //친구추가 이후 친구목록 다시 불러오기
                     getFriendList(memberInfo);
                 }
             } className="btn btn-outline-secondary" type="button"
                 id="button-addon2"><img className="icon" src={add2} alt="" /></button>
         </div>
          </ExpansionPanel>
          <ExpansionPanel title="친구">
{data.map(my_friends => (
        <p onClick={() => {
            setTo(my_friends.email);
            setToname(my_friends.name);
            abc(my_friends);
        }
        }
            key={my_friends.id}>{my_friends.name}<br /></p>
    ))}
          </ExpansionPanel>


        </Sidebar>
         <ChatContainer>
<ConversationHeader>
                                        <ConversationHeader.Back />
                                        <Avatar src={profile} name="Zoe" />
                                        <ConversationHeader.Content
                                          userName={toname}
                                        />

                                      </ConversationHeader>
                                      <MessageList>
                                       <MessageList.Content
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      justifyContent: "center",
                                                      height: "100%",
                                                      textAlign: "center",
                                                      fontSize: "1em"
                                                    }}
                                                  >
                                            {to ?
                                                    (
                                                                <> <MessageList>
                                                                {prev ? (
                                                                <>
                                                                    {prev.map((item, index) => (
                                                                        <>
                                                                        { item.id === -1?
                                                                        (null)
                                                                        : (
                                                                            item.fromuser === memberInfo.email ? (
                                                                                <>
                                                                                    <Message key={index} model={{ direction: "outgoing", message: item.message, sentTime: item.sysdate }}>
                                                                                        {item.avatar ? (
                                                                                            <Avatar src={item.avatar.src} name={item.avatar.name} />
                                                                                        ) : null}
                                                                                    </Message><p className="RightAlign">{item.sysdate}</p></>
                                                                            ) : (
                                                                                <>
                                                                                    <Message key={index} model={{ direction: "incoming", message: item.message, sentTime: item.sysdate }}>
                                                                                        {item.avatar ? (
                                                                                            <Avatar src={item.avatar.src} name={item.avatar.name} />
                                                                                        ) : null}
                                                                                    </Message><p className="LeftAlign">{item.sysdate}</p></>
                                                                            )

                                                                         )}

                                                                        </>
                                                                    ))}
                                                                </>) : null
                                                                }

                                                                    {messages.map((item, index) => (
                                                                        <>
                                                                            {item.fromuser === memberInfo.email ? (
                                                                                   <>
                                                                                    <Message key={index} model={{ direction: "outgoing", message: item.message, sentTime: item.sysdate }}>
                                                                                        {item.avatar ? (
                                                                                            <Avatar src={item.avatar.src} name={item.avatar.name} />
                                                                                        ) : null}
                                                                                    </Message><p className="RightAlign">{item.sysdate}</p>
                                                                                    </>
                                                                            ) : (
                                                                            <>
                                                                                    <Message key={index} model={{ direction: "incoming", message: item.message, sentTime: item.sysdate }}>
                                                                                        {item.avatar ? (
                                                                                            <Avatar src={item.avatar.src} name={item.avatar.name} />
                                                                                        ) : null}
                                                                                    </Message><p className="LeftAlign">{item.sysdate}</p>
                                                                                    </>
                                                                            )}
                                                                        </>
                                                                    ))} </MessageList><MessageInput placeholder="" onSend={handleSend} />

                                                                </>

                                                    ) : (<p>대화를 시작해보세요.</p>)
                                                }  </MessageList.Content> </MessageList>


                </ChatContainer>



                                   <Sidebar position="right" scrollable={false}>
                                      <Search placeholder="Search..." />
                                      <ConversationList>
                                       {chatData.map(my_friends => (
                                       <Conversation
                                         name={my_friends.name}
                                         info={my_friends.message}
                                         lastActivityTime={my_friends.sysdate}
                                         onClick={() => {
                                                           setTo(my_friends.email);
                                                           setToname(my_friends.name);
                                                           abc(my_friends);
                                                       }
                                                       }

                                       >
                                         <Avatar src={profile} name="Lilly" status="available" />
                                       </Conversation>
                                      ))}
                                      </ConversationList>
                                    </Sidebar>
                            </MainContainer>
            </div>

        );
    } else { //로그인 안된 경우 로그인페이지로 이동
        return <Navigate to="/" />;
    }

}

export default Main;