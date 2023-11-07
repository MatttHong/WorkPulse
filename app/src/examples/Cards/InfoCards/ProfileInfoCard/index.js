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

// react-routers components
import {Link} from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import {useEffect, useState} from "react";

function ProfileInfoCard({
                             title,
                             description,
                             firstNameProp,
                             lastNameProp,
                             birthdayProp,
                             social,
                             shadow,
                             editMode,
                             onToggleEditMode,
                             onSave
                         }) {
    const labels = [];
    const values = [];
    const {socialMediaColors} = colors;
    const {size} = typography;

    // Convert this form `objectKey` of the object key in to this `object key`
    // Object.keys(info).forEach((el) => {
    //     if (el.match(/[A-Z\s]+/)) {
    //         const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
    //         const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
    //
    //         labels.push(newElement);
    //     } else {
    //         labels.push(el);
    //     }
    // });

    // Push the object values into the values array
    // Object.values(info).forEach((el) => values.push(el));

    const [firstName, setFirstName] = useState(firstNameProp);
    const [lastName, setLastName] = useState(lastNameProp);
    const [birthday, setBirthday] = useState(birthdayProp);

    useEffect(() => {
        setFirstName(firstNameProp);
        setLastName(lastNameProp);
        setBirthday(birthdayProp);
    }, [firstNameProp, lastNameProp, birthdayProp]);

    const editOrSaveIcon = editMode ? <SaveIcon /> : <EditIcon />;
    const handleEditSaveClick = () => {
        if (editMode) {
            updateUserInfo(); // Save the user info
        } else {
            onToggleEditMode(); // Just enter edit mode
        }
    };
    const updateUserInfo = async () => {
        try {
            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            const updatedInfo = {
                firstName,
                lastName,
                birthday,
            };

            const response = await axios.put(`http://localhost:3000/api/users/${userId}`, updatedInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response.status === 200) {
                console.log('User updated successfully');
                onSave(updatedInfo); // Call onSave with the updated info
            } else {
                console.error('Update failed:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating the user data:', error);
        }
    };

    // Render the card info items
    const renderItems = () => (
        <>
            <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold">
                    First Name: &nbsp;
                </MDTypography>
                {editMode ? (
                    <TextField
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="standard"
                        fullWidth
                    />
                ) : (
                    <MDTypography variant="button" fontWeight="regular" color="text">
                        {firstName}
                    </MDTypography>
                )}
            </MDBox>
            <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold">
                    Last Name: &nbsp;
                </MDTypography>
                {editMode ? (
                    <TextField
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        variant="standard"
                        fullWidth
                    />
                ) : (
                    <MDTypography variant="button" fontWeight="regular" color="text">
                        &nbsp;{lastName}
                    </MDTypography>
                )}
            </MDBox>
            <MDBox display="flex" py={1} pr={2}>
                <MDTypography variant="button" fontWeight="bold">
                    Birthday: &nbsp;
                </MDTypography>
                {editMode ? (
                    <TextField
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        variant="standard"
                        fullWidth
                        type="date"
                    />
                ) : (
                    <MDTypography variant="button" fontWeight="regular" color="text">
                        &nbsp;{birthdayProp}
                    </MDTypography>
                )}
            </MDBox>
            {/* Add other fields as needed */}
        </>
    );

    // Render the card social media icons
    const renderSocial = social.map(({link, icon, color}) => (
        <MDBox
            key={color}
            component="a"
            href={link}
            target="_blank"
            rel="noreferrer"
            fontSize={size.lg}
            color={socialMediaColors[color].main}
            pr={1}
            pl={0.5}
            lineHeight={1}
        >
            {icon}
        </MDBox>
    ));

    return (
        <Card sx={{height: "100%", boxShadow: !shadow && "none"}}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    {title}
                </MDTypography>
                <Tooltip title={editMode ? "Save" : "Edit"} placement="top">
                    <IconButton onClick={handleEditSaveClick}>
                        {editOrSaveIcon}
                    </IconButton>
                </Tooltip>
            </MDBox>
            <MDBox p={2}>
                <MDBox mb={2} lineHeight={1}>
                    <MDTypography variant="button" color="text" fontWeight="light">
                        {description}
                    </MDTypography>
                </MDBox>
                {renderItems()}
                <MDBox opacity={0.3}>
                    <Divider/>
                </MDBox>
                <MDBox>
                    {renderItems}
                    <MDBox display="flex" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            social: &nbsp;
                        </MDTypography>
                        {renderSocial}
                    </MDBox>
                </MDBox>
            </MDBox>
        </Card>
    );
}

ProfileInfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    firstNameProp: PropTypes.string,
    lastNameProp: PropTypes.string,
    birthdayProp: PropTypes.string,
    social: PropTypes.arrayOf(PropTypes.object).isRequired,
    shadow: PropTypes.bool,
    editMode: PropTypes.bool,
    onToggleEditMode: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    // Add any other props you're using
};

ProfileInfoCard.defaultProps = {
    shadow: true,
    editMode: false,
    // Add any other default props you're using
};
export default ProfileInfoCard;
