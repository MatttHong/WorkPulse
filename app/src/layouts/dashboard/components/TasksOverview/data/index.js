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
import Checkbox from '@mui/material/Checkbox';


export default function data(userLogs) {
    const avatars = (members) =>
        members.map(([image, name]) => (
            <Tooltip key={name} title={name} placeholder="bottom">
                <MDAvatar
                    src={image}
                    alt="name"
                    size="xs"
                    sx={{
                        border: ({borders: {borderWidth}, palette: {white}}) =>
                            `${borderWidth[2]} solid ${white.main}`,
                        cursor: "pointer",
                        position: "relative",

                        "&:not(:first-of-type)": {
                            ml: -1.25,
                        },

                        "&:hover, &:focus": {
                            zIndex: "10",
                        },
                    }}
                />
            </Tooltip>
        ));

    const Company = ({image, name}) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm"/>
            <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    return {
        columns: [
            {Header: " ", accessor: "checkbox", width: "5%", align: "left"}, // Added a new column for checkboxes
            {Header: "Task Name", accessor: "name", width: "45%", align: "left"},
            {Header: "completion", accessor: "completion", align: "center"},
        ],

        rows: [
            {
                checkbox: (
                    <Checkbox
                        // onChange={(event) => handleCheckboxChange(event, 'Material UI XD Version')}
                        // You would need to handle the state management and submission logic in `handleCheckboxChange`
                    />
                ),
                name: <Company name="Material UI XD Version"/>,
                completion: (
                    <MDTypography variant="caption" color="text" fontWeight="medium">
                        Completed
                    </MDTypography>
                ),
            },
            {
                name: <Company name="Add Progress Track"/>,
                completion: (
                    <MDTypography variant="caption" color="text" fontWeight="medium">
                        Completed
                    </MDTypography>
                ),
            },
            {
                name: <Company name="Fix Platform Errors"/>,
                completion: (
                    <MDTypography variant="caption" color="text" fontWeight="medium">
                        Completed
                    </MDTypography>
                ),
            },
            {
                companies: <Company name="Launch our Mobile App"/>,
                completion: (
                    <MDTypography variant="caption" color="text" fontWeight="medium">
                        Completed
                    </MDTypography>
                ),
            },
            {
                name: <Company name="Add the New Pricing Page"/>,
                completion: (
                    <MDTypography variant="caption" color="text" fontWeight="medium">
                        Completed
                    </MDTypography>
                ),
            },
            {
                name: <Company name="Redesign New Online Shop"/>,
                completion: (
                    <MDTypography variant="caption" color="text" fontWeight="medium">
                        Completed
                    </MDTypography>
                ),
            },
        ],
    };
}
