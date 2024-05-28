import './App.css';
import {useEffect, useState} from "react";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';


function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/showMe")
        .then((res) => {
          return res.json();
        })
        .then(function (result) {
            setData(result);
      })
  },[]);


  return (
    <div class="container">
      <br />로그인<br /><br />
      <div class="p-3 mb-2 bg-light text-dark border rounded">
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        비밀번호를 잊으셨나요?
        <ul>
          {data.map((v, idx) => <li key={`${idx}-${v}`}>{v}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
