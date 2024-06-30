import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import logoimg from './image/logo2.png';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import edit1 from './image/edit1.png';
import edit2 from './image/edit2.png';
import edit3 from './image/edit3.png';
import edit4 from './image/edit4.png';
import add1 from './image/add1.png';
import { Stomp } from "@stomp/stompjs";
import { io } from "socket.io-client";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Avatar,
} from "@chatscope/chat-ui-kit-react";


//    <div class="d-none d-lg-block col-md-12 col-lg-6">
function Main() {

    const stompClient = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [email, setEmail] = useState();
    const location = useLocation();
    const memberInfo = { ...location.state };
    const [memEmail, setMemEmail] = useState("");
    const [friEmail, setFriEmail] = useState("");
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState([]);
    const [messages, setMessages] = new useState([]);
    const [to, setTo] = useState("");
    const [room, setRoom] = useState();
    var selected = ""


    //웹소켓 연결
    const connect = () => {
        console.log("==============connect=================")
        const socket = new WebSocket("ws://localhost:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/sub/chatroom/` + room, (message) => {
                const newMessage = JSON.parse(message.body);
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
    }, []);


    //FIXME
    // 현재 미사용중
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
                console.log('실패')
            })
    }


    //친구추가
    const postNewFriend = (memberInfo, friEmail) => {
        axios.post('/main/addfriend', {
            memEmail: memberInfo.email,
            friEmail: friEmail
        })
            .then(response => { console.log(response.data); })
            .catch(function () {
                console.log('친구추가 실패')
            }) ;
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
        setTemp([...temp, newMessage]);
    };


    //토글버튼 함수
    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!'),
        );
        return (
            <button
                type="button"
                style={{ backgroundColor: 'pink' }}
                onClick={decoratedOnClick}
            >
                {children}
            </button>
        );
    }

    //채팅방번호 가져오기
    const abc = (my_friends) => {
        axios.post('/talk', {
            user1: memberInfo.email,
            user2: my_friends.friEmail
        })
            .then(response => { console.log(response.data); setRoom(response.data); return response.data })
            .catch(function () {
                console.log('talk실행 실패')
            });
    }

    const ddd = (my_friends) => {
        abc(my_friends);
        console.log("확인......." + room)
    }


    //로그인 된 경우 메인화면 렌더링
    if (memberInfo.email != null) {
        return (

            <div>
                <>
                    <Navbar className="bg-body-tertiary">
                        <Navbar.Brand href="#main">
                            MONCHAT
                        </Navbar.Brand>
                    </Navbar>
                </>
                <Row>

                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 col-lg-3">
                                <Col className="">
                                    <ul className="list-group">
                                        <li className="list-group-item bg-secondary bg-opacity-10">내 프로필
                                        </li>
                                        <li className="list-group-item bg-secondary bg-opacity-10">
                                            <div className="CenterAlign"><img className="profile " src={edit2} alt="" /></div>
                                            {memberInfo.name}<br />{memberInfo.email}
                                            <div className="row">
                                                <div className="col-2">
                                                </div>
                                            </div>
                                        </li>

                                        <li className="list-group-item bg-secondary bg-opacity-10">
                                            <Accordion defaultActiveKey="0">
                                                <Card.Header>
                                                    친구추가
                                                    <CustomToggle eventKey="1">+</CustomToggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="1">
                                                    <Card.Body>
                                                        <div className="input-group mb-3">
                                                            <input onChange={(e) => {
                                                                setFriEmail(e.target.value);
                                                            }} type="text" className="form-control" placeholder="이메일 입력"
                                                                aria-label="Recipient's username" aria-describedby="button-addon2"></input>
                                                            <button onClick={
                                                                () => {
                                                                    //친구추가요청
                                                                    postNewFriend(memberInfo, friEmail);
                                                                    //친구추가 이후 친구목록 다시 불러오기
                                                                    getFriendList(memberInfo);
                                                                }
                                                            } className="btn btn-outline-secondary" type="button"
                                                                id="button-addon2"><img className="icon" src={add1} alt="" /></button>
                                                        </div>

                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Accordion>
                                        </li>
                                        <li className="list-group-item bg-secondary bg-opacity-10">
                                            <Accordion defaultActiveKey="0">
                                                <Card.Header>
                                                    친구
                                                    <CustomToggle eventKey="1">+</CustomToggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="1">
                                                    <Card.Body>
                                                        {data.map(my_friends => (
                                                            <p onClick={() => {
                                                                setTo(my_friends.friEmail);
                                                                ddd(my_friends);
                                                                console.log("채팅방번호 확인용 로그" + room)
//                                                                axios.get('/prevmessages/' + temp, {
//                                                                params :
//                                                                    {room: temp}
//                                                                })
//                                                                  .then(response => { console.log(response.data)} )
//                                                                  .catch(function () {
//                                                                    console.log('prevmessages실행 실패')
//                                                                  })
                                                                ;

                                                            }
                                                            }
                                                                key={my_friends.id}>{my_friends.friEmail}<br /></p>
                                                        ))}
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Accordion>
                                        </li>
                                    </ul>
                                </Col>
                            </div>

                            <div className="col-md-12 col-lg-6">
                                <ul>
                                    <div>
                                        <div>
                                            <p>현재대화상대: {to}</p>
                                            <p>채팅방번호: {room}</p>
                                            <div style={{
                                                position:
                                                    "relative", height: "500px"
                                            }}>
                                                {to ?
                                                    (
                                                        <MainContainer>
                                                            <ChatContainer>
                                                                <MessageList>
                                                                    {messages.map((item, index) => (

                                                                        <div>
                                                                            {item.fromuser === memberInfo.email ? (
                                                                                <div>
                                                                                    <Message key={index} model={{ direction: "outgoing", message: item.message }}>
                                                                                        {item.avatar ? (
                                                                                            <Avatar src={item.avatar.src} name={item.avatar.name} />
                                                                                        ) : null}
                                                                                    </Message><p className="RightAlign">{item.sysdate}</p></div>
                                                                            ) : (
                                                                                <div>
                                                                                    <Message key={index} model={{ direction: "incoming", message: item.message }}>
                                                                                        {item.avatar ? (
                                                                                            <Avatar src={item.avatar.src} name={item.avatar.name} />
                                                                                        ) : null}
                                                                                    </Message><p className="LeftAlign">{item.sysdate}</p></div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </MessageList>
                                                                <MessageInput placeholder="" onSend={handleSend} />

                                                            </ChatContainer>
                                                        </MainContainer>
                                                    ) : (<p>대화를 시작해보세요.</p>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </ul>
                            </div>

                            <div className="col-md-9 col-lg-3">
                                <Col className="">
                                    채팅<br />
                                    <ul className="list-group">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="me-auto">
                                                <div className="fw-bold">mark zuckerberg</div>
                                                hey🙂
                                            </div>
                                            <span className="badge text-bg-primary rounded-pill">3</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="me-auto">
                                                <div className="fw-bold">류선재</div>
                                                자니?
                                            </div>
                                            <span className="badge text-bg-primary rounded-pill">2</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="me-auto">
                                                <div className="fw-bold">elon musk</div>
                                                어디임
                                            </div>
                                            <span className="badge text-bg-primary rounded-pill">1</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="me-auto">
                                                <div className="fw-bold">복권회사</div>
                                                축하합니다 복권에당첨되셨습니다
                                            </div>
                                            <span className="badge text-bg-primary rounded-pill">1</span>
                                        </li>
                                    </ul>
                                </Col>
                            </div>
                        </div>
                    </div>
                </Row>
            </div>

        );
    } else { //로그인 안된 경우 로그인페이지로 이동
        return <Navigate to="/" />;
    }

}

export default Main;