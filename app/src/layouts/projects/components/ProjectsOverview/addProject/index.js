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

import { useState } from "react";
// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";


// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";


function AddProjectComponent ({ onAddProject }) {

  const [email, setEmail] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [administrator, setAdministrator] = useState([]);
  const [administratorEmail, setAdministratorEmail] = useState('');
  const [employee, setEmployee] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [task, setTask] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [department, setDepartment] = useState([]);
  const [departmentName, setDepartmentName] = useState('');


const header = "test Header";
const body = "test body";

    // Add these to the state declarations within AddProjectComponent
const [openTaskDialog, setOpenTaskDialog] = useState(false);

// Function to open the task dialog
const handleOpenTaskDialog = () => {
  setOpenTaskDialog(true);
};

// Function to close the task dialog
const handleCloseTaskDialog = () => {
  setOpenTaskDialog(false);
};

   const handleAddAdministrator = () => {
    if (administratorEmail) {
      setAdministrator([...administrator, administratorEmail]);
      setAdministratorEmail(''); 
    }
  };
  const handleAddEmployee = () => {
    if (employeeEmail) {
      setEmployee([...employee, employeeEmail]);
      setEmployeeEmail(''); 
    }
  };
  const handleAddDepartment = () => {
    if (departmentName) {
      setDepartment([...department, departmentName]);
      setDepartmentName(''); 
    }
  };
  
  const collectFormData = () => {
    return {
      businessId,
      name,
      status,
      administrator,
      employee,
      task,
      department,
    };
  };
  const handleSubmit = () => {
    if (validateFields() && tasks.length > 0) { // Ensure tasks are also added
        const formData = {
        //   administratorEmail,
        //   employeeEmail,
          tasks
        };
        onAddProject(formData);
      } else {
      }
  };


  // State for error messages
  const [errors, setErrors] = useState({});

    // State for tasks
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  // Validate input fields and update the errors state
  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    // Add similar checks for other fields
    if (!businessId) {
      isValid = false;
      newErrors.businessId = 'Business ID is required';
    }
    if (!name) {
        isValid = false;
        newErrors.name = 'Project Name is required';
    }
    if (!status) {
        isValid = false;
        newErrors.status = 'Project Status is required';
    }
    if (!administratorEmail) {
        isValid = false;
        newErrors.administrator = 'Adminisrator is required';
    }
    if (!employeeEmail) {
        isValid = false;
        newErrors.employee = 'Employee is required';
    }
    if (!departmentName) {
        isValid = false;
        newErrors.department = 'Department is required';
    }
    if (!taskName) {
        isValid = false;
        newErrors.task = 'Task is required';
    }

    setErrors(newErrors);
    return isValid;
  };


  return (
    <MDBox>
        {tasks.map((task, index) => (
        <div key={index}>
          {/* Render each task details */}
          <p>{task.taskName}</p>
          {/* ... Render other task details ... */}
        </div>
      ))}
      <MDButton onClick={handleOpenTaskDialog}>Add Task</MDButton>
        <MDInput
           label="Project Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           error={!!errors.name}
           helperText={errors.name || ''}
        />
        <MDInput
        label="Project Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        error={!!errors.status}
        helperText={errors.status || ''}
      />
      <MDInput
           label="Project Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           error={!!errors.name}
           helperText={errors.name || ''}
        />
        <MDInput
        label="Business ID"
        value={businessId}
        onChange={(e) => setBusinessId(e.target.value)}
        error={!!errors.businessId}
        helperText={errors.businessId || ''}
      />
      <MDInput
           label="Project Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           error={!!errors.name}
           helperText={errors.name || ''}
        />
        <MDInput
        label="Business ID"
        value={businessId}
        onChange={(e) => setBusinessId(e.target.value)}
        error={!!errors.businessId}
        helperText={errors.businessId || ''}
      />


        <MDInput
            type="text"
            placeholder="Project Status"
            value={status}
            onChange={(e) => setEmail(e.target.value)}
        />
        <MDBox>
        {administrator.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Add Administrator Email"
          value={administratorEmail}
          onChange={(e) => setAdministratorEmail(e.target.value)}
        />
        <MDButton onClick={handleAddAdministrator}>Add Email</MDButton>
      </MDBox>
      <MDBox>
        {department.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Add Department"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <MDButton onClick={handleAddDepartment}>Add Email</MDButton>
      </MDBox>
      
      <MDBox>
        {employee.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Add Employee Email"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />
        <MDButton onClick={handleAddEmployee}>Add Employee</MDButton>
      </MDBox>
      <MDBox>
        {task.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Add Task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </MDBox>
      //submit form data
      <MDButton onClick={handleSubmit}>Add</MDButton>
      <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog}>
  <DialogTitle>Add New Task</DialogTitle>
  {/* <DialogContent>
    <TaskForm addTask={handleAddTask} />
  </DialogContent> */}
  <DialogActions>
    <MDButton onClick={handleCloseTaskDialog} color="error">
      Cancel
    </MDButton>
  </DialogActions>
</Dialog>
    </MDBox>
  );
};

export default AddProjectComponent;

