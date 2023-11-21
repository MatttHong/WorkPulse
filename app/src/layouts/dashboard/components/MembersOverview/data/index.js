import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Checkbox from '@mui/material/Checkbox';
import DataTable from "../../../../../examples/Tables/DataTable";
import {useEffect, useState} from "react";


export default function TaskData(userProjects, userAdmins, handleUpdateTask) {
    const [userTasks, setUserTasks] = useState([]);

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

    function findProjectNameByTaskId(taskId) {
        const project = userProjects.find((project) => project.tasks && project.tasks.includes(taskId));
        return project ? project.projectName : 'Unknown';
    }

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     const updateTask = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:3000/api/task/${task._id}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: "Bearer " + token,
    //                 }
    //             });
    //
    //             if (response.ok) {
    //                 set
    //                 // Additional logic after successful update
    //             } else {
    //                 console.error(`Failed to update task ${task._id}:`, response.status);
    //             }
    //         } catch (error) {
    //             console.error(`Error updating task ${task._id}:`, error);
    //         }
    //     };
    //
    //     console.log("PASAYI G*TTEN");
    //     userTasks?.sort((a, b) => {
    //         const projectNameA = findProjectNameByTaskId(a._id);
    //         const projectNameB = findProjectNameByTaskId(b._id);
    //         if (projectNameA !== projectNameB) {
    //             return projectNameA.localeCompare(projectNameB);
    //         }
    //         return a.taskName.localeCompare(b.taskName);
    //     });
    // }, [userTasks]);


    return (
        <DataTable
            table={{
                columns: [
                    {Header: " ", accessor: "checkbox"},
                    {Header: "Task Name", accessor: "name", width: "45%", align: "left"},
                    {Header: "Project", accessor: "project", width: "45%", align: "left"},
                    {Header: "Admin", accessor: "admin", align: "center"},
                    {Header: "Status", accessor: "status", align: "center"},
                ],
                rows: Array.isArray(userTasks) ? userTasks.map((task) => ({
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
                    name: <Company name={task.taskName}/>,
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
                })):[],
            }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
        />
    );
}
