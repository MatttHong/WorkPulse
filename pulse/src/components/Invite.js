import React, { useState } from 'react';

const InviteComponent = () => {
  const [email, setEmail] = useState('');
  const [businessId, setBusinessId] = useState('');
  const header = "Email Invitation";
  const body = "test"

  const sendInvitation = async () => {
    const invitationData = {
        businessId: businessId,
        email: email,
        header: header,
        body: body,
    };
    const BACKEND_ENDPOINT = 'http://localhost:3001/api/invite';
    try {
        const response = await fetch(BACKEND_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invitationData)
        });
        
        const data = await response.json();
        // Handle the response: e.g., showing a success message
    } catch (error) {
        // Log the error or display a message to the user
        console.error('Error sending invitation:', error);
    }
  };

  return (
    <div>
        <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="text"
            placeholder="Business ID"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
        />
        
        <button onClick={sendInvitation}>Send Invitation</button>
    </div>
  );
};

export default InviteComponent;
