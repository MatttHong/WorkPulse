import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDBox from 'components/MDBox';
import React, { useState } from 'react';

const InviteComponent = () => {
  const [email, setEmail] = useState('');
  const [businessId, setBusinessId] = useState('');

const header = "test Header";
const body = "test body";

  const sendInvitation = async () => {
    const invitationData = {
        businessId: businessId,
        email: email,
        header: header,
        body: body,
    };
    const BACKEND_ENDPOINT = 'http://localhost:3000/api/invite';
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
    <MDBox>
        <MDInput
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <MDInput
            type="text"
            placeholder="Business ID"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
        />
        <MDButton onClick={sendInvitation}>Send Invitation</MDButton>
    </MDBox>
  );
};

export default InviteComponent;