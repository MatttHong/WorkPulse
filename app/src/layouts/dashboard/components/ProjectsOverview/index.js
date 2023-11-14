import {useState, useCallback, useEffect} from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/ProjectsOverview/data";



function Projects() {
    const [userLogs, setUserLogs] = useState([]); // Initial state as null or appropriate default
    const {columns, rows} = data(userLogs);

    useEffect(() => {
        // Function to fetch logs
        const fetchLogs = async () => {
            // Get user id from local storage
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token');

            if (userId) {
                try {
                    const response = await fetch(`http://localhost:3000/api/log/employee/${userId}`,{
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUserLogs(data.logs);
                        console.log(userLogs);
                    } else {
                        console.error('Failed to fetch logs:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching logs:', error);
                }
            }
        };
        fetchLogs();
    }, []);

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
                            &nbsp;<strong>{userLogs.length}</strong> done this month
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
