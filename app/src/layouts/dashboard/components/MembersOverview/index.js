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
import axios from "axios";

const fetchUserData = async () => {
    const userEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/email/${userEmail}`, {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
    return response.data.user;
};

const fetchEmployeeData = async (employeeID) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/employee/${employeeID}`, {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
    return response.data.employee.tasks;
};

const fetchTaskData = async (taskId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/task/${taskId}`, {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
    return response.data.task;
};

function MembersOverview() {
    const completedTaskStyle = {
        textDecoration: 'line-through',
        color: 'lightgrey'
    };

    function findUserNameById(userId) {
        const user = userAdmins.find((admin) => admin._id === userId);
        return user ? `${user.firstName} ${user.lastName}` : '';
    }

    function findProjectNameByTaskId(taskId) {
        const project = userProjects.find((project) => project.tasks && project.tasks.includes(taskId));
        return project ? project.projectName : 'Unknown';
    }

    function sortTasks(taskA, taskB) {
        // Sort by status (Active tasks first)
        if (taskA.status !== taskB.status) {
            return taskA.status === 'Finished' ? 1 : -1;
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
        const newStatus = task.status === 'Finished' ? 'Active' : 'Finished';
        setBestUserTasks(bestUserTasks.map(f => {
            if (f._id === task._id) {
                return {...task, status: newStatus}
            }
            return f;
        }))
        const token = localStorage.getItem('token');
        const updateTask = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/task/${task._id}`, {
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
    const [bestUserTasks, setBestUserTasks] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/proj/`, {
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
                            const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${adminId}`, {
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
                            const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/task/${taskID}`, {
                                headers: {
                                    Authorization: "Bearer " + token,
                                }
                            });

                            if (userResponse.ok) {
                                const taskData = await userResponse.json();
                                console.log("OOOOOOOOOOOOOOOOOTASKDATA:", taskData);
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

        const initializeData = async () => {
            try {
                const userData = await fetchUserData();
                console.log("USERDATA", userData);
                const taskIds = await fetchEmployeeData(userData.employments[0]);
                // Fetch all tasks concurrently
                const tasksPromises = taskIds.map(taskId => fetchTaskData(taskId));
                const tasks = await Promise.all(tasksPromises);

                // Update bestUserTasks with the fetched tasks
                setBestUserTasks(tasks);
            } catch (error) {
                console.error('Error fetching user tasks:', error);
            }
        };

        fetchProjects();
        initializeData();
    }, []);

    console.log("PROJECTS", userProjects);
    console.log("ADMINS", userAdmins);
    console.log("TASKS", userTasks);
    console.log("BESTTASKS", bestUserTasks);


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
                            &nbsp;<strong>{Array.isArray(bestUserTasks) ? bestUserTasks.filter(task => task.status === 'Finished').length : 0}</strong> done
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
                            {Header: "Admin", accessor: "admin", align: "center"},
                            {Header: "Status", accessor: "status", align: "center"},
                        ],
                        rows: Array.isArray(bestUserTasks) ? bestUserTasks.map((task) => ({
                            checkbox: (
                                <Checkbox
                                    checked={task.status === 'Finished'}
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
                                    style={task.status === 'Finished' ? completedTaskStyle : null}
                                  >
                                    {task.taskName}
                            </MDTypography>,
                            admin: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {Array.isArray(task.taskAdministrators) ? task.taskAdministrators.map(findUserNameById).join(' ') : 'No Admins'}
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
