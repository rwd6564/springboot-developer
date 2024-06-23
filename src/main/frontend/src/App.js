import './App.css';
import {useEffect, useState} from "react";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import logoimg from './image/logo2.png';
import Join from './Join.js';
import Home from './Home.js';
import Main from './Main.js';
import Chat from './Chat.js';
import Test from './Test.js';


function App() {

/*
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/articles")
        .then((res) => {
          return res.json();
        })
        .then(function (result) {
            console.log(result)
            setData(result);
        })
  },[]);

    console.log(data)
*/

/*        <div>
        <div>
          <ul>
            {data.map(user => (
              <li>제목: {user.title}, 내용: {user.content}</li>
            ))}
          </ul>
        </div>
        </div> */


  return (

          <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/join" element={<Join />}/>
                    <Route path="/main" element={<Main />}/>
                    <Route path="/chat" element={<Chat />}/>
                    <Route path="/test" element={<Test />}/>
                  </Routes>
          </BrowserRouter>
  );
}

export default App;
