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
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import {useEffect, useState} from "react";
import axios from "axios";

function Overview() {

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        birthday: "",
        bio: "",
        organizations: "",
        dateJoined: "",
        userType: ""
        // store more data...
    });

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const userEmail = localStorage.getItem("email");
            const response = await axios.get(`http://localhost:3000/api/users/email/${userEmail}`, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });


            if (response.data.status === "Success") {
                const user = response.data.user;
                setUserData({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    birthday: user.birthday,
                    bio: user.bio,
                    employments: user.employments,
                    userType: user.userType
                    // get more data...
                });
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox mb={2}/>
            <Header userData={userData}>
                <MDBox mt={5} mb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6} xl={4} sx={{display: "flex"}}>
                            <Divider orientation="vertical" sx={{ml: -2, mr: 1}}/>
                            <ProfileInfoCard
                                title="bio"
                                description={userData.bio}
                                info={{
                                    // fullName: `${userData.firstName} ${userData.lastName}`,
                                    // birthday: `${userData.birthday}`,
                                    // email: `${userData.email}`,
                                    // companies: `${userData.employments}`
                                    fullName: "Randy Jackson",
                                    birthday: "07/20/2020",
                                    email: "a@b.com",
                                    organizations: "Architects4Good",
                                    dateJoined: "03/11/2021",

                                }}
                                social={[
                                    {
                                        link: "https://linkedin.com",
                                        icon: <LinkedInIcon/>,
                                        color: "linkedin",
                                    },
                                    // {
                                    //     link: "https://twitter.com/creativetim",
                                    //     icon: <TwitterIcon/>,
                                    //     color: "twitter",
                                    // },
                                    // {
                                    //     link: "https://www.instagram.com/creativetimofficial/",
                                    //     icon: <InstagramIcon/>,
                                    //     color: "instagram",
                                    // },
                                ]}
                                action={{route: "", tooltip: "Edit Profile"}}
                                shadow={false}
                            />
                            <Divider orientation="vertical" sx={{mx: 0}}/>
                        </Grid>
                        {/*Platform Settings*/}
                        {/*******************/}
                        <Grid item xs={12} md={6} xl={4}>
                            {/*<PlatformSettings/>*/}
                        </Grid>
                        {/*Conversation with other users*/}
                        {/*******************************/}
                        {/*<Grid item xs={12} xl={4}>*/}
                        {/*  <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />*/}
                        {/*</Grid>*/}
                    </Grid>
                </MDBox>
                <MDBox pt={2} px={2} lineHeight={1.25}>
                    <MDTypography variant="h6" fontWeight="medium">
                        Projects
                    </MDTypography>
                    <MDBox mb={1}>
                        <MDTypography variant="button" color="text">
                            Architects design houses
                        </MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox p={2}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6} xl={3}>
                            <DefaultProjectCard
                                image={homeDecor1}
                                label="project #1"
                                title="Living Room Design"
                                description="Create the living room design"
                                action={{
                                    type: "internal",
                                    route: "/pages/profile/profile-overview",
                                    color: "info",
                                    label: "view project",
                                }}
                                authors={[
                                    {image: team1, name: "Elena Morison"},
                                    {image: team2, name: "Ryan Milly"},
                                    {image: team3, name: "Nick Daniel"},
                                    {image: team4, name: "Peterson"},
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} xl={3}>
                            <DefaultProjectCard
                                image={homeDecor2}
                                label="project #2"
                                title="Bed Room Design"
                                description="Create the design for the bed room"
                                action={{
                                    type: "internal",
                                    route: "/pages/profile/profile-overview",
                                    color: "info",
                                    label: "view project",
                                }}
                                authors={[
                                    {image: team3, name: "Nick Daniel"},
                                    {image: team4, name: "Peterson"},
                                    {image: team1, name: "Elena Morison"},
                                    {image: team2, name: "Ryan Milly"},
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} xl={3}>
                            <DefaultProjectCard
                                image={homeDecor3}
                                label="project #3"
                                title="Furniture Selection"
                                description="Pick what furniture must be bought for new house "
                                action={{
                                    type: "internal",
                                    route: "/pages/profile/profile-overview",
                                    color: "info",
                                    label: "view project",
                                }}
                                authors={[
                                    {image: team4, name: "Peterson"},
                                    {image: team3, name: "Nick Daniel"},
                                    {image: team2, name: "Ryan Milly"},
                                    {image: team1, name: "Elena Morison"},
                                ]}
                            />
                        </Grid>
                        
                    </Grid>
                </MDBox>
            </Header>
            <Footer/>
        </DashboardLayout>
    );
}

export default Overview;
