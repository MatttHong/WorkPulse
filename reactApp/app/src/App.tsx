import React from 'react';
import './style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import Home from "./Home";
import Individual from "./IndividualSPA";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="auth" element={<Auth />} />
                <Route path="individual" element={<Individual />} />
                {/* Removed the direct route to Dashboard, as it's now part of WorkerSPA */}
            </Routes>
        </BrowserRouter>
    );
}
