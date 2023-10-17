import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const InviteHandler = () => {
  const queryParams = useQueryParams();
  
  useEffect(() => {
    const token = queryParams.get('token');
    const employeeId = queryParams.get('employeeId');
    
    const verifyInvite = async () => {
      try {
        const response = await axios.put('http://localhost:3000/api/invite', {
          token,
          employeeId
        });
        console.log(response.data);
        // Handle success - navigate to a success page or show a message
      } catch (error) {
        console.error('Invite verification error:', error);
        // Handle error - show an error message or navigate to an error page
      }
    };

    verifyInvite();
  }, [queryParams]);

  return (
    <div>
      Verifying your invite...
      {/* You might want to show a loader here */}
    </div>
  );
};

export default InviteHandler;
