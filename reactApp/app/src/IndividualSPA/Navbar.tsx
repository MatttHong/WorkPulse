import React from 'react';
import './css/Navbar.css';  // You can create a separate CSS file for styling

interface NavbarProps {
    changeView: (view: string) => void;
}

function Navbar({ changeView }: NavbarProps) {
    // These are placeholders, in a real-world application, this data would likely come from user context or a similar source
    const profilePic = "assets/img/defaultprofilepic.jpg"; // replace with path to the user's profile picture or a default one
    const userName = "John";
    const userLastName = "Doe";

    return (
        <div className="navbar">
            <div className="navbar-header">
                <img src={profilePic} alt={`${userName} ${userLastName}`} className="profile-pic" />
                <h2>{userName} {userLastName}</h2>
            </div>
            <div className="navbar-options">
                <button onClick={() => changeView('dashboard')}>Dashboard</button>
                <button onClick={() => changeView('profile')}>Profile</button>
                {/* Implement the logout functionality here. It might involve clearing authentication tokens and redirecting to the auth page */}
                <button>Log Out</button>
            </div>
        </div>
    );
}

export default Navbar;
