import React from 'react';
import './css/Profile.css';

function Profile() {
    const user = {
        profilePic: "assets/img/defaultprofilepic.jpg", // Path to the user's profile pic
        firstName: "John",
        lastName: "Doe",
        organization: "TechCorp Inc."
    };

    return (
        <div className="profile-container">
            <img className="profile-pic" src={user.profilePic} alt="User Profile" />
            <h2>{user.firstName} {user.lastName}</h2>
            <p><strong>Organization:</strong> {user.organization}</p>

            <div className="change-password-section">
                <h3>Change Password</h3>
                <input type="password" placeholder="Current Password" />
                <input type="password" placeholder="New Password" />
                <input type="password" placeholder="Confirm New Password" />
                <button>Update Password</button>
            </div>
        </div>
    );
}

export default Profile;
