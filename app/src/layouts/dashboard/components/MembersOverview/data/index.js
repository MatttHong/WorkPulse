import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Checkbox from '@mui/material/Checkbox';


export default function data(userProjects, userAdmins, userTasks, handleCompleteTask) {

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

    // Function to find the project name by task id
    function findProjectNameByTaskId(taskId) {
        const project = userProjects.find((project) => project.tasks && project.tasks.includes(taskId));
        return project ? project.projectName : 'Unknown';
    }

    // Transform the tasks data into the required format for the rows
    const taskRows = userTasks.map((task) => ({
        checkbox: (
            <Checkbox
                color="primary"
                inputProps={{
                    'aria-label': 'select all desserts',
                }}
            />
        ),
        name: <Company name={task.taskName} />,
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
    }));

    return {
        columns: [
            { Header: " ", accessor: "checkbox" },
            { Header: "Task Name", accessor: "name", width: "45%", align: "left" },
            { Header: "Project", accessor: "project", width: "45%", align: "left" },
            { Header: "Admin", accessor: "admin", align: "center" },
            { Header: "Status", accessor: "status", align: "center" },
        ],
        rows: taskRows,
    };
}
