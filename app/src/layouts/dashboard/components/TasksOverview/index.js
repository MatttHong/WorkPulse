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

import {useState, useCallback, useEffect} from "react";



import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/TasksOverview/data";
import TaskForm from "./addTask";
import axios from "axios";



function Tasks() {
    const [userProjects, setUserProjects] = useState([]); // Initial state as null or appropriate default
    const [userAdmins, setUserAdmins] = useState([]);
    const {columns, rows} = data(userProjects, userAdmins);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`http://localhost:3000/api/proj/`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserProjects(data.projects); // Set all the projects

                    // Fetch each project administrator's details
                    for (const project of data.projects) {
                        for (const adminId of project.projectAdministrators) {
                            const userResponse = await fetch(`http://localhost:3000/api/users/${adminId}`, {
                                headers: {
                                    Authorization: "Bearer " + token,
                                }
                            });

                            if (userResponse.ok) {
                                const adminData = await userResponse.json();
                                setUserAdmins(prevAdmins => [...prevAdmins, adminData.user]);
                            } else {
                                console.error('Failed to fetch admin data:', userResponse.status);
                            }
                        }
                    }
                } else {
                    console.error('Failed to fetch projects:', response.status);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);


    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                        Projects
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" lineHeight={0}>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;Total <strong>{userProjects.length} </strong>
                        </MDTypography>
                    </MDBox>
                </MDBox>
            </MDBox>
            <MDBox>
                <DataTable
                    table={{columns, rows}}
                    showTotalEntries={false}
                    isSorted={false}
                    noEndBorder
                    entriesPerPage={false}
                />
            </MDBox>

        </Card>
    );
}

export default Tasks;
