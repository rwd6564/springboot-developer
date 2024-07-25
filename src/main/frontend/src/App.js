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



function App() {

  return (

          <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/join" element={<Join />}/>
                    <Route path="/main" element={<Main />}/>

                  </Routes>
          </BrowserRouter>
  );
}

export default App;
