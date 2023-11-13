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

import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

// react-router-dom components
import {Link} from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {

    const navigation = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            console.log("Sending request with data:", {email, password});
            const response = await axios.post("http://localhost:3000/api/auth", {email, password});

            if (response.data.status === "Success") {
                console.log("Received response:", response);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('id', response.data.id);
                // Assuming that the backend returns userType in the response
                const userType = response.data.userType;

                if (userType === "Individual") {
                    navigation("/dashboard");
                } else {
                    // Redirect to a different dashboard if needed
                    navigation("/otherDashboard");
                }

            } else {
                localStorage.removeItem('token');
                // Handle unsuccessful login, e.g., show an error message to the user
                console.log("Received response:", response);
            }
        } catch (error) {
            // Handle errors like network issues or server errors
        }
    };


    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Sign in
                    </MDTypography>

                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form" onSubmit={handleSignIn}>
                        <MDBox mb={2}>
                            <MDInput type="email" label="Email" fullWidth value={email}
                                     onChange={(e) => setEmail(e.target.value)}/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" label="Password" fullWidth value={password}
                                     onChange={(e) => setPassword(e.target.value)}/>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Switch checked={rememberMe} onChange={handleSetRememberMe}/>
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                onClick={handleSetRememberMe}
                                sx={{cursor: "pointer", userSelect: "none", ml: -1}}
                            >
                                &nbsp;&nbsp;Remember me
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton type="submit" variant="gradient" color="info" fullWidth>
                                sign in
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Don&apos;t have an account?{" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-up"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Sign up
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Basic;
