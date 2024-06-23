import { useRef, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Stomp, CompatClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import io from 'socket.io-client';
import axios from 'axios';


function Chat() {

const stompClient = useRef(null);
const [messages, setMessages] = new useState([]);
const [inputValue, setInputValue] = useState('');
const handleInputChange = (event) => {
    setInputValue(event.target.value);
}


useEffect(()=> {
    connect();
    fetchMessages();
    return () => disconnect();
}, []);

const connect = () => {
const socket = new WebSocket("ws://localhost:8080/ws");
stompClient.current = Stomp.over(socket);
stompClient.current.connect({}, ()=> {
stompClient.current.subscribe(`/sub/chatroom/1`, (message) => {
const newMessage = JSON.parse(message.body);
setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
});
};

const disconnect = () => {
    if (stompClient.current) {
    stompClient.current.disconnect();
    }
};



const fetchMessages = () => {
return axios.get("http://localhost:8080/chat/1")
    .then(response => {setMessages(response.data)});
};

const sendMessage = () => {
    if (stompClient.current && inputValue) {
        const body = {
            id: 1,
            name: "테스트1",
            message: inputValue
    };
    stompClient.current.send(`/pub/message`, {},
    JSON.stringify(body));
        setInputValue('');

    }
};




return (

  <div>
    <ul>
      <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={sendMessage}>입력</button>
      </div>
      {messages.map((item, index) =>(
      <div key={index} className="list-item">{item.message}</div>
      ))}

    </ul>
  </div>
)

}


export default Chat;

