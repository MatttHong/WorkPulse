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

import {useEffect, useState} from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/MembersOverview/data";


function MembersOverview() {
    const handleCompleteTask = (taskId) => {
        setUserTasks((prevTasks) =>
            prevTasks.map((task) => {
                if (task._id === taskId) {
                    return { ...task, status: 'Completed' };
                }
                return task;
            })
                .sort((a, b) => (a.status === 'Completed' ? 1 : -1)) // Sort tasks after updating the status
        );
    };

    const [userProjects, setUserProjects] = useState([]); // Initial state as null or appropriate default
    const [userAdmins, setUserAdmins] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const {columns, rows} = data(userProjects, userAdmins, userTasks, handleCompleteTask);

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

                    for (const project of data.projects) {
                        for (const taskID of project.tasks) {
                            const userResponse = await fetch(`http://localhost:3000/api/task/${taskID}`, {
                                headers: {
                                    Authorization: "Bearer " + token,
                                }
                            });

                            if (userResponse.ok) {
                                const taskData = await userResponse.json();
                                setUserTasks(prevTasks => [...prevTasks, taskData.task]);
                            } else {
                                console.error('Failed to fetch task data:', userResponse.status);
                            }
                        }
                    }
                } else {
                    console.error('Failed to fetch tasks:', response.status);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchProjects();
    }, []);

    console.log("PROJECTS", userProjects);
    console.log("ADMINS", userAdmins);
    console.log("TASKS", userTasks);

    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                         Tasks
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" lineHeight={0}>
                        <Icon
                            sx={{
                                fontWeight: "bold",
                                color: "green",
                                mt: -0.5,
                            }}
                        >
                            done
                        </Icon>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;<strong>1</strong> done
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

export default MembersOverview;
