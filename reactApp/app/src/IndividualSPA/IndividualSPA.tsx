import React, { useState } from 'react';
import './css/IndividualSPA.css';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Profile from './Profile';

function IndividualSPA() {
    const [currentView, setCurrentView] = useState("dashboard"); // default view

    return (
        <div className="app-container">
            <Navbar changeView={setCurrentView} />
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'profile' && <Profile />}
            {/* You can extend this for more views as needed */}
        </div>
    );
}

export default IndividualSPA;
