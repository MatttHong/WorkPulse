import React from 'react';
import './style.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "./Auth";
import Home from "./Home";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
  );
}