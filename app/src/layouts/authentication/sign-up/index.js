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

// react-router-dom components
import * as React from 'react';
import {Link, useLocation} from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import {useEffect, useState} from "react";
import {token} from "stylis";

function Cover() {
    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        birthday: '',
        email: '',
        password: '',
        userType: ''
    });
    const [feedback, setFeedback] = useState('');

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUserTypeChange = (event, newUserType) => {
        setFormData({
            ...formData,
            userType: newUserType
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            ...formData,
            inviteToken,
            employeeId
        };

        // Make an API call to create user
        try {
            const response = await fetch('http://localhost:3000/api/users', { // replace with your backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setFeedback('User created successfully!');
            } else {
                const data = await response.json();
                setFeedback(data.error || 'An error occurred.');
            }

            if (employeeId !== '') {

            }
        } catch (error) {
            setFeedback('An error occurred.');
        }
    };

    const [inviteToken, setInviteToken] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const queryEmployeeId = searchParams.get('employeeId');

        console.log("11111111111111111111");
        if (token && queryEmployeeId) { // Corrected condition
            setInviteToken(token);
            setEmployeeId(queryEmployeeId);
            console.log("TOKEN:", token);
            console.log("EMPLOYEE ID:", queryEmployeeId); // Corrected variable
        }
        console.log("22222222222222222222");
    }, [location]);

    return (
        <CoverLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    mx={2}
                    mt={-3}
                    p={3}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Join us today
                    </MDTypography>
                    <MDTypography display="block" variant="button" color="white" my={1}>
                        Fill your information to register
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form" onSubmit={handleSubmit}>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Username"
                                variant="standard"
                                fullWidth
                                name="userName"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="First Name"
                                variant="standard"
                                fullWidth
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Last Name"
                                variant="standard"
                                fullWidth
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="date"
                                // label="Birthday"
                                variant="standard"
                                fullWidth
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleInputChange}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="email"
                                label="Email"
                                variant="standard"
                                fullWidth
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                label="Password"
                                variant="standard"
                                fullWidth
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton type="submit" variant="gradient" color="info" fullWidth>
                                sign up
                            </MDButton>
                        </MDBox>
                        {feedback === "User created successfully!" && (
                            <MDBox mt={1} mb={1} textAlign="center">
                                <MDTypography variant="button" color="text">
                                    User created successfully!{" "}
                                    <MDTypography
                                        component={Link}
                                        to="/authentication/sign-in"
                                        variant="button"
                                        color="info"
                                        fontWeight="medium"
                                        textGradient
                                    >
                                        Click here to Sign In
                                    </MDTypography>
                                </MDTypography>
                            </MDBox>
                        )}
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Already have an account?{" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-in"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Sign In
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </CoverLayout>
    );
}

export default Cover;
