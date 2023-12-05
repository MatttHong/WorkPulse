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
import React from 'react';
import {useEffect, useState} from "react";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import Checkbox from "@mui/material/Checkbox";


function MembersOverview() {
    const Company = ({name}) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                {name}
            </MDTypography>
        </MDBox>
    );

    const completedTaskStyle = {
        textDecoration: 'line-through',
        color: 'lightgrey'
    };

    function findUserNameById(userId) {
        const user = userAdmins.find((admin) => admin._id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
    }

    function findProjectNameByTaskId(taskId) {
        const project = userProjects.find((project) => project.tasks && project.tasks.includes(taskId));
        return project ? project.projectName : 'Unknown';
    }

    function sortTasks(taskA, taskB) {
        // Sort by status (Active tasks first)
        if (taskA.status !== taskB.status) {
            return taskA.status === 'Completed' ? 1 : -1;
        }
 
        // Sort by project name
        const projectNameA = findProjectNameByTaskId(taskA._id);
        const projectNameB = findProjectNameByTaskId(taskB._id);
        if (projectNameA !== projectNameB) {
            return projectNameA.localeCompare(projectNameB);
        }

        // Sort by task name
        return taskA.taskName.localeCompare(taskB.taskName);
    }

    function handleUpdateTask(task) {
        const newStatus = task.status === 'Completed' ? 'Active' : 'Completed';
        setUserTasks(userTasks.map(f => {
            if (f._id === task._id) {
                return {...task, status: newStatus}
            }
            return f;
        }))
        const token = localStorage.getItem('token');
        const updateTask = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/task/${task._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({status: newStatus})
                });

                if (response.ok) {
                    console.log(`Task ${task._id} updated successfully.`);
                    // Additional logic after successful update
                } else {
                    console.error(`Failed to update task ${task._id}:`, response.status);
                }
            } catch (error) {
                console.error(`Error updating task ${task._id}:`, error);
            }
        };

        updateTask();
    }

    const [userProjects, setUserProjects] = useState([]);
    const [userAdmins, setUserAdmins] = useState([]);
    const [userTasks, setUserTasks] = useState([]);

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
                            &nbsp;<strong>{userTasks.filter(task => task.status === 'Completed').length}</strong> done
                        </MDTypography>
                    </MDBox>
                </MDBox>
            </MDBox>
            <MDBox>
                <DataTable
                    table={{
                        columns: [
                            {Header: " ", accessor: "checkbox"},
                            {Header: "Task Name", accessor: "name", width: "45%", align: "left"},
                            {Header: "Project", accessor: "project", width: "45%", align: "left"},
                            {Header: "Admin", accessor: "admin", align: "center"},
                            {Header: "Status", accessor: "status", align: "center"},
                        ],
                        rows: Array.isArray(userTasks) ? userTasks.sort(sortTasks).map((task) => ({
                            checkbox: (
                                <Checkbox
                                    checked={task.status === 'Completed'}
                                    onChange={() => handleUpdateTask(task)}
                                    color="primary"
                                    inputProps={{
                                        'aria-label': 'select all desserts',
                                    }}
                                />
                            ),
                            name: <MDTypography
                                    variant="caption"
                                    color="text"
                                    fontWeight="medium"
                                    style={task.status === 'Completed' ? completedTaskStyle : null}
                                  >
                                    {task.taskName}
                            </MDTypography>,
                            project: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {findProjectNameByTaskId(task._id)}
                                </MDTypography>
                            ),
                            admin: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {Array.isArray(task.taskAdministrators) ? task.taskAdministrators.map(findUserNameById).join(', ') : 'No Admins'}
                                </MDTypography>
                            ),
                            tasks: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {Array.isArray(task.employees) ? task.employees.map(findUserNameById).join(', ') : 'No Assignees'}
                                </MDTypography>
                            ),
                            status: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {task.status}
                                </MDTypography>
                            )
                        })) : [],
                    }}
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
