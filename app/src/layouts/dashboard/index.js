// @mui material components
import React, { useEffect } from 'react';
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Dashboard components
import ProjectsOverview from "layouts/dashboard/components/ProjectsOverview";
import TasksOverview from "layouts/dashboard/components/TasksOverview";
import MembersOverview from "layouts/dashboard/components/MembersOverview";

import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router} from "react-router-dom";
// import InviteComponent from "components/MembersOverview/invite/invite";


function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if 'id' is present in the local storage
        if (!localStorage.getItem('id')) {
            // Redirect to sign-in page if 'id' is not found
            navigate('/authentication/sign-in');
        }
    }, [navigate]);


    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox py={3}>
                <MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TasksOverview/>
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            <MembersOverview/>
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            <ProjectsOverview/>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default Dashboard;

