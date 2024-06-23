import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
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



function Main() {

const [messagess, setMessagess] = useState([]);


//전송버튼 눌렀을때
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
            from: memberInfo.email,
            to:"to부분",
            message: input
    };
    stompClient.current.send(`/pub/message`, {},
    JSON.stringify(body));
    }

setMessagess([...messagess, newMessage]);

};

//
//{messages.map((item, index) =>(
//<div key={index} className="list-item">{item.message}</div>
//))}


const getMessageComponent = (data) => {
  return data.map((item, index) => {
    return (
      <Message key={index} model={item.model}>
        {item.avatar ? (
          <Avatar src={item.avatar.src} name={item.avatar.name} />
        ) : null}
      </Message>
    );
  });
};





const stompClient = useRef(null);
const [messages, setMessages] = new useState([]);
const [inputValue, setInputValue] = useState('');
const handleInputChange = (event) => {
    setInputValue(event.target.value);
}



var selected = ""

useEffect(()=> {
    connect();
    fetchMessages();
    return () => disconnect();
}, []);

const connect = () => {
console.log("==============connect시작=================")
const socket = new WebSocket("ws://localhost:8080/ws");
stompClient.current = Stomp.over(socket);
stompClient.current.connect({}, ()=> {
stompClient.current.subscribe(`/sub/chatroom/1`, (message) => {
console.log("=============sub시작================", message.command)
const newMessage = JSON.parse(message.body);
setMessages((prevMessages) => [...prevMessages, newMessage]);
//setMessagess((prevMessagess) => [...prevMessagess, newMessage]);
    });
});
};

const disconnect = () => {
    if (stompClient.current) {
    stompClient.current.disconnect();
    }
};



const fetchMessages = () => {
console.log("==============fetch시작=================")
return axios.get("/main/1")
    .then(response => {setMessages(response.data);console.log(response.data) } );

};

const sendMessage = () => {
console.log("==============send시작=================")
    if (stompClient.current && inputValue) {
        const body = {
            id: 1,
            from: memberInfo.email,
            to:"to부분",
            message: inputValue
    };
    stompClient.current.send(`/pub/message`, {},
    JSON.stringify(body));
        setInputValue('');
    }

};




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




const [email, setEmail] = useState();

const location = useLocation();
const memberInfo = { ...location.state };

//console.log('받은 멤버정보', memberInfo)

const [memEmail, setMemEmail] = useState("");
const [friEmail, setFriEmail] = useState("");

const [data, setData] = useState([]);

  useEffect(() => {
        axios.get('/api/main/friends', {
          params: {
            memEmail: memberInfo.email
          }
        })
          .then(response => { console.log(response.data); setData(response.data) })
          .catch(function () {
            console.log('실패')
          })
  },[]);

    //로그인 된 경우
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


<div class="container">
  <div class="row">
    <div class="col-md-3 col-lg-3">
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
                  친구추가<CustomToggle eventKey="1">+</CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <div className="input-group mb-3">
                      <input onChange={(e) => {
                        setFriEmail(e.target.value);
                      }} type="text" className="form-control" placeholder="이메일 입력" aria-label="Recipient's username" aria-describedby="button-addon2"></input>
                      <button onClick={
                        () => {
                          axios.post('/main/addfriend', {
                            memEmail: memberInfo.email,
                            friEmail: friEmail
                          })
                            .then(response => { console.log(response.data); })
                            .catch(function () {
                              console.log("메일", memEmail, friEmail)
                              console.log('login_faild')
                            })
                        }
                      } className="btn btn-outline-secondary" type="button" id="button-addon2"><img className="icon" src={add1} alt="" /></button>
                    </div>

                  </Card.Body>
                </Accordion.Collapse>
              </Accordion>
            </li>
            <li className="list-group-item bg-secondary bg-opacity-10">
              <Accordion defaultActiveKey="0">
                <Card.Header>
                  친구<CustomToggle eventKey="1">+</CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    {data.map(my_friends => (
                      <a href="http://localhost:3000/main"
                      key={my_friends.id}>{my_friends.friEmail}<br/></a>
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Accordion>
            </li>
          </ul>
        </Col>
    </div>




    <div class="d-none d-lg-block col-md-12 col-lg-6">
        <ul>
          <div>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <button onClick={sendMessage}>입력</button>
            {messages.map((item, index) =>(
            <div key={index} className="list-item">{item.message}</div>
            ))}
            <div>
              <div style={{ position: "relative", height: "500px" }}>
                <MainContainer>
                  <ChatContainer>
                    <MessageList>{getMessageComponent(messagess)}</MessageList>
                    <MessageInput placeholder="" onSend={handleSend} />
                  </ChatContainer>
                </MainContainer>
              </div>
            </div>
          </div>

        </ul>
    </div>







    <div className="col-md-9 col-lg-3">
    <Col className="">채팅<br />
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