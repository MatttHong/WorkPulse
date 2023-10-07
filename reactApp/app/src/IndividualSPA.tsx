import React, {useState} from 'react';
import './IndividualSPA.css';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Profile from './Profile';

function IndividualSPA() {
    const [currentView, setCurrentView] = useState("dashboard"); // default view

    return (
        <div className="app-container">
            <Navbar changeView={setCurrentView} />
            {currentView === 'dashboard' && <Dashboard />}
            {/* You can extend this for more views as needed */}
        </div>
    );
}

export default IndividualSPA;
