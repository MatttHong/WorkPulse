// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
// Overview page components
import Header from "layouts/profile/components/Header";
// React components
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

    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState(userData.firstName);
    const [lastName, setLastName] = useState(userData.lastName);
    const [birthday, setBirthday] = useState(userData.birthday);

    const handleToggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleSave = (updatedUserInfo) => {
        if (updatedUserInfo) {
            userData.firstName = updatedUserInfo.firstName;
            userData.lastName = updatedUserInfo.lastName;
            userData.birthday = updatedUserInfo.birthday;
        }
        setEditMode(false);
    };


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userEmail = localStorage.getItem("email");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/email/${userEmail}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });

                if (response.data.status === "Success") {
                    const user = response.data.user;

                    setUserData(user);

                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setBirthday(user.birthday);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, []);

    console.log("USER: ", userData);

    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox mb={2}/>
            <Header userData={userData}>
                <MDBox mt={5} mb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6} xl={4} sx={{display: "flex"}}>
                            <Divider orientation="vertical" sx={{ml: -2, mr: 1}}/>
                            <div data-testid="ProfileInfoCard-component">
                            <ProfileInfoCard
                                title="bio"
                                bioProp={userData.bio}
                                firstNameProp={firstName}
                                lastNameProp={lastName} 
                                birthdayProp={birthday} 
                                editMode={editMode} // Pass the editMode flag
                                onToggleEditMode={handleToggleEditMode}
                                onSave={handleSave}
                                onFirstNameChange={(e) => setFirstName(e.target.value)} // Pass the handler for firstName
                                onLastNameChange={(e) => setLastName(e.target.value)} // Pass the handler for lastName
                                onBirthdayChange={(e) => setBirthday(e.target.value)} // Pass the handler for birthday
                                shadow={false}
                            />
                            </div>
                            <Divider orientation="vertical" sx={{mx: 0}}/>
                        </Grid>
                        {/*Platform Settings*/}
                        {/*******************/}
                        <Grid item xs={12} md={6} xl={4}>
                            {/*<PlatformSettings/>*/}
                        </Grid>
                    </Grid>
                </MDBox>
            </Header>
        </DashboardLayout>
    );
}

export default Overview;
