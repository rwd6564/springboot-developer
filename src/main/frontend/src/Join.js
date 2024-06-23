import {useEffect, useState} from "react";
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import logoimg from './image/logo2.png';
import axios from 'axios';


function Join() {


const [email, SetEmail] = useState("");
const [pw, SetPw] = useState("");
const [name, SetName] = useState("");
const [page, SetPage] = useState("default");

//const navigate = useNavigate();
//const goToHome = () => {
//navigate("/");
//};

const [data, setData] = useState([]);

//  useEffect(() => {
//    fetch("/api/members")
//        .then((res) => {
//          return res.json();
//        })
//        .then(function (result) {
//            console.log(result)
//            setData(result);
//        })
//  },[]);
//
//            <input type="text" onChange={onChange}></input>
//            <button onClick={onClick}>버튼</button>
//            <p>input 입력값: {name}</p>

if (page == "default")  {
    return (
<div>
  <div className="CenterAlign">
  <p>MONCHAT</p>
  </div>
          <div>
          <div>
            <ul>
              {data.map(user => (
                <li>제목: {user.email}, 내용: {user.pw}</li>
              ))}
            </ul>
          </div>
          </div>

<form className="row g-3">
<h3>회원가입</h3>
  <div className="col-12">
    <input onChange={(e) => {
                       SetEmail(e.target.value);
                     }} type="email" className="form-control" id="inputEmail4" placeholder="이메일 주소를 입력해주세요."></input>
  </div>
  <div className="col-12">
    <input onChange={(e) => {
                       SetPw(e.target.value);
                     }} type="password" className="form-control" id="inputPassword3" placeholder="비밀번호"></input>
    * 영문, 숫자, 특수문자를 혼합하여 8~20자의 비밀번호를 입력해주세요.
  </div>
  <div className="col-12">
    <input type="password" className="form-control" id="inputPassword4" placeholder="비밀번호 확인"></input>
  </div>
  <div className="col-12">
    <input onChange={(e) => {
                       SetName(e.target.value);
                     }} type="text" className="form-control" id="inputAddress2" placeholder="이름"></input>
  </div>
<label htmlFor="inputState" className="form-label">[선택] 생년월일</label>
  <div className="col-md-2">
    <select id="inputState1" className="form-select">
      <option default>년</option>
                  {BIRTHDAY_YEAR_LIST.map((year, index) => (
                    <option key={index}>{year}</option>
                  ))}
    </select>
  </div>
  <div className="col-md-2">
    <select id="inputState2" className="form-select">
      <option default>월</option>
                  {BIRTHDAY_MONTH_LIST.map((month, index) => (
                    <option key={index}>{month}</option>
                  ))}
    </select>
  </div>
  <div className="col-md-2">
    <select id="inputState3" className="form-select">
      <option default>일</option>
                  {BIRTHDAY_DAY_LIST.map((day, index) => (
                    <option key={index}>{day}</option>
                  ))}
    </select>

  </div>
  <div className="col-12">
    <button onClick={
                          () => {
                            axios.post('/join/member', {
                                email: email,
                                pw: pw,
                                name: name
                            })
                              .then(response => { console.log(response.data) })
                              .then(()=> SetPage("success"))
                              .catch(function () {
                                console.log('실패함'+email+pw+name)
                              })
                          }
                        }
    type="button" className="btn btn-primary col-12">가입</button>
  </div>
</form>
</div>
    ); } else{
    return (
    <div>
    <p>{email}님,<br/>회원가입이 완료되었습니다.</p>
              <Link to="/">
                <button type="button" className="btn btn-link btn-sm col-6 border rounded">로그인 ></button>
              </Link>
    </div>

      );
    }
  }


export default Join;

const BIRTHDAY_YEAR_LIST = Array.from(
  { length: 90 },
  (_, i) => `${i + 1935}년`,
);
const BIRTHDAY_MONTH_LIST = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
const BIRTHDAY_DAY_LIST = Array.from({ length: 31 }, (_, i) => `${i + 1}일`);




