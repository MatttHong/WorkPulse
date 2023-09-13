import React from 'react';
import '../public/assets/css/style.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "./Auth";
import Home from "./Home";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="home" index element={<Home />} />
            <Route path="auth" element={<Auth />} />
        </Routes>f
      </BrowserRouter>
  );
}