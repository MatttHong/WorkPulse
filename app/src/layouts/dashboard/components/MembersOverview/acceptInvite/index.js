import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AcceptInvitation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      acceptInvitation(token);
    } else {
      console.error('No invitation token provided in the URL');
      navigate('/error'); // Replace '/error' with the path to your error page
    }
  }, [location, navigate]);

  const acceptInvitation = async (token) => {
    try {
      const response = await axios.post('/api/invitation/accept', { token });
      console.log('Invitation accepted:', response.data);
      // Check the response to make sure the user was added correctly
      if (response.data.success) {
        // If the backend indicates success, navigate to the dashboard
        navigate('/dashboard'); // Replace '/dashboard' with the path to the user's dashboard or home page
      } else {
        // If the backend indicates failure, log the reason and redirect to an error page
        console.error('Failed to accept invitation:', response.data.message);
        navigate('/error'); // Replace '/error' with the path to your error page
      }
    } catch (error) {
      console.error('Error accepting invitation:', error.response ? error.response.data : error.message);
      navigate('/error'); // Replace '/error' with the path to your error page
    }
  };

  // Render nothing or a loading indicator as the user will be immediately redirected
  return null;
};

export default AcceptInvitation;
