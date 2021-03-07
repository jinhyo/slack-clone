import App from "@layouts/App";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
// <App />을 index.html의  <div id="app"></div> 안에 랜더링 함

// pages - 서비스 페이지
// components - 짜잘 컴포넌트
// layouts - 공통 레이아웃
