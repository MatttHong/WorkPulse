/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function InviteComponent () {

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
        console.log("TESTING GOOD");
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