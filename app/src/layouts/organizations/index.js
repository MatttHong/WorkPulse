// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import OrganizationsOverview from "layouts/organizations/components/OrganizationsOverview";
import axios from "axios";
import {useEffect, useState} from "react";

function Dashboard() {
    const token = localStorage.getItem("token");
    const [orgId, setOrgId] = useState("");
    const [orgEmail, setOrgEmail] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteOrgId, setInviteOrgId] = useState('');

    useEffect(() => {
        async function fetchData() {
            const userData = await fetchUserData();
            console.log("X1:", userData);
            if (userData.employments[0]) {
                const employeeID = userData.employments[0];
                const employeeData = await fetchEmployeeData(employeeID);
                if (employeeData.orgId) {
                    const employeeOrgId = employeeData.orgId;
                    setOrgId(employeeOrgId);
                }
            }
            // ...rest of your code
        }

        fetchData();
    }, [orgId]);


    const fetchUserData = async () => {
        const userEmail = localStorage.getItem("email");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/email/${userEmail}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
        return response.data.user;
    };

    const fetchEmployeeData = async (employeeID) => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/employee/${employeeID}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
        return response.data.employee;
    };

    const handleInvite = async () => {
        // Function to make backend call
        console.log('Inviting with Email:', inviteEmail, 'Org ID:', inviteOrgId);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/invite`, {
                email: inviteEmail,
                orgId: inviteOrgId
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });

            console.log("INVITE RESPONSE:", response);
        } catch (error) {
            console.error('Error sending invite:', error);
        }
    };

    const handleCreateOrg = async () => {
        console.log('Create Organization clicked.');

        const userData = await fetchUserData();
        const xEmployeeID = userData.employments[0];

        try {
            const createOrgResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/org/`, {
                organizationName: "New Organization Name",
                organizationEmail: orgEmail,  // Use the orgEmail from the state
                organizationAdministrators: [xEmployeeID],
                employees: [xEmployeeID],
                industry: "industry"
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });

            console.log("CREATE ORG RESPONSE:", createOrgResponse);

            const newOrgId = createOrgResponse.data.org._id;

            await axios.put(`${process.env.REACT_APP_API_URL}/api/employee/${xEmployeeID}`, {
                orgId: newOrgId,
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });

        } catch (error) {
            console.error('Error creating organization:', error);
        }
    };

    console.log("skjdfhakjsdh", orgId);



    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox py={3}>
                <MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <Grid container alignItems="center" spacing={3} sx={{mb: 3}}>
                                <Grid item>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Org ID"
                                        variant="outlined"
                                        value={inviteOrgId}
                                        onChange={(e) => setInviteOrgId(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" onClick={handleInvite} sx={{color: 'white !important'}}>
                                        Invite
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Organization Email"
                                        variant="outlined"
                                        value={orgEmail}
                                        onChange={(e) => setOrgEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" onClick={handleCreateOrg}
                                            sx={{color: 'white !important'}}>
                                        Create Organization
                                    </Button>
                                </Grid>
                            </Grid>
                            <div data-testid="Organization-component">
                                {orgId !== "" && <OrganizationsOverview/>}
                            </div>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
            <div data-testid="Footer-component">
                <Footer/>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;

