import React from 'react';
import {useState, useEffect} from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/ProjectsOverview/data";
import axios from "axios";

const fetchEmployeeID = async () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem("email");
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/email/${userEmail}`, {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
    return response.data.user.employments[0];
};


function Projects() {
    const [userLogs, setUserLogs] = useState([]); // Initial state as null or appropriate default

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            const employeeId = await fetchEmployeeID(); // Ensure this function is defined and returns the employee ID

            if (employeeId) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employee/${employeeId}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const logIds = data.employee.logs;

                        // Fetch all logs concurrently
                        const logPromises = logIds.map(logId =>
                            fetch(`${process.env.REACT_APP_API_URL}/api/log/${logId}`, {
                                headers: { Authorization: "Bearer " + token }
                            }).then(res => res.json())
                        );

                        const logs = await Promise.all(logPromises);
                        setUserLogs(logs);
                    } else {
                        console.error('Failed to fetch employee data:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching employee data:', error);
                }
            }
        };

        fetchLogs();
    }, []);

    const {columns, rows} = data(userLogs);
    console.log("LOGSSSSSSSSSSS:", userLogs);
    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                        Sessions
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" lineHeight={0}>
                        <Icon
                            sx={{
                                fontWeight: "bold",
                                color: ({palette: {info}}) => info.main,
                                mt: -0.5,
                            }}
                        >
                            done
                        </Icon>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;<strong>{userLogs.length}</strong> done
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

export default Projects;
