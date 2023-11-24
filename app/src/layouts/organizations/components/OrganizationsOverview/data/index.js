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


export default function data(userProjects, userAdmins, userTasks) {

    const Company = ({image, name}) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    function findUserNameById(userId) {
        const user = userAdmins.find((admin) => admin._id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
    }


    // Transform the projects data into the required format for the rows
    const projectRows = userProjects.map((project) => ({
        name: <Company name={project.projectName} />,
        admin: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {project.projectAdministrators.map(findUserNameById).join(', ')}
            </MDTypography>
        ),
        tasks: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {project.tasks.length}
            </MDTypography>
        ),
        status: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {project.status}
            </MDTypography>
        )
    }));

    return {
        columns: [
            { Header: "Project Name", accessor: "name", width: "45%", align: "left" },
            { Header: "Project", accessor: "project", width: "45%", align: "left" },
            { Header: "Admin", accessor: "admin", align: "center" },
            { Header: "Tasks", accessor: "tasks", align: "center" },
            { Header: "Status", accessor: "status", align: "center" },
        ],
        rows: projectRows,
    };
}