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
                             bioProp,
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

    const [firstName, setFirstName] = useState(firstNameProp);
    const [lastName, setLastName] = useState(lastNameProp);
    const [birthday, setBirthday] = useState(birthdayProp);
    const [bio, setBio] = useState(bioProp);

    useEffect(() => {
        setFirstName(firstNameProp);
        setLastName(lastNameProp);
        setBirthday(birthdayProp);
        setBio(bioProp);
    }, [firstNameProp, lastNameProp, birthdayProp, bioProp]);

    const editOrSaveIcon = editMode ? <SaveIcon /> : <EditIcon />;
    const handleEditSaveClick = () => {
        if (editMode) {
            updateUserInfo();
        } else {
            onToggleEditMode();
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
                bio
            };

            const response = await axios.put(`http://localhost:3000/api/users/${userId}`, updatedInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response.status === 200) {
                console.log('User updated successfully');
                onSave(updatedInfo);
            } else {
                console.error('Update failed:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating the user data:', error);
        }
    };

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
                        {lastName}
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
                        {birthday}
                    </MDTypography>
                )}
            </MDBox>
        </>
    );

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
                <MDBox display="flex" py={1} pr={2}>
                    {editMode ? (
                        <TextField
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            variant="standard"
                            fullWidth
                            multiline
                            rows={1}
                        />
                    ) : (
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            {bio}
                        </MDTypography>
                    )}
                </MDBox>
                {renderItems()}
                <MDBox opacity={0.3}>
                    <Divider/>
                </MDBox>
                <MDBox>
                    {renderItems}
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
};

ProfileInfoCard.defaultProps = {
    shadow: true,
    editMode: false,
};
export default ProfileInfoCard;
