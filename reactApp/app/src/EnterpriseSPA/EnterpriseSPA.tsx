import React, {useState} from "react";
import Navbar from "../IndividualSPA/Navbar";
import Dashboard from "../IndividualSPA/Dashboard";


function EnterpriseSPA() {
    const [currentView, setCurrentView] = useState("dashboard"); // default view

    return (
        <div className="app-container">
            <Navbar changeView={setCurrentView} />
            {currentView === 'dashboard' && <Dashboard />}
            {/* You can extend this for more views as needed */}
        </div>
    );
}
export default EnterpriseSPA;
