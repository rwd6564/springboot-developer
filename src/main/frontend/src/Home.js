import {useEffect, useState} from "react";
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import logoimg from './image/logo2.png';
import Join from './Join.js';
import axios from 'axios';


function Home() {


const [email, setEmail] = useState("");
//const [name, setName] = useState("");
const [pw, setPw] = useState("");
const [data, setData] = useState([]);
const [page, setPage] = useState("default");

var name;
name = ""
const navigate = useNavigate();

  const goToMain = () => {

    navigate("/main", {
    state: {
    email: email,
    pw: pw,
    name: name,
           }
    });
//    console.log("보내는데이터확인", email, pw, name)
  };

    return (
<div>
  <div className="Logo">
    <img src={logoimg} alt="" />
  </div>

    <div className="CenterAlign">
      Sign in to MONCHAT<br /><br />
    </div>

    <div className="Login">
      <div className="p-3 mb-2 bg-light text-dark border rounded">
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onChange={(e) => {
            setEmail(e.target.value);
          }} type="email" placeholder="이메일" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={(e) => {
            setPw(e.target.value);
          }} type="password" placeholder="비밀번호" />
        </Form.Group>

        <div>

          <div className="CenterAlign">
            <button onClick={
              () => {
                axios.get('/home/login', {
                  params: {
                    email: email,
                    pw: pw
                  }
                })
                  .then(response => { console.log(response.data); name = response.data.name } )
                  .then(goToMain)
                  .catch(function () {
                    console.log('login_faild')
                    setPage("error")
                  })
              }
            }
              type="button" className="btn btn-success btn-sm col-12">로그인</button>
          </div>
          <div className="CenterAlignMd">{page === 'error' ? <p>이메일 또는 비밀번호가 틀렸습니다.</p> : null}</div>

          <div className="CenterAlignMd">
            <button type="button" className="btn btn-link btn-sm col-12">비밀번호 찾기 ></button>
          </div>
        </div>
      </div>

    </div>
    <div className="Login">
      <div className="CenterAlign">
        <Link to="/join">
          <button type="button" className="btn btn-link btn-sm col-12 border rounded">아직 회원이 아니신가요? ></button>
        </Link>
      </div>
    </div>

</div>
    );

}



export default Home;