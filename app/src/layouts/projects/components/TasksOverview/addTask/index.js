import React, { useState } from 'react';
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import MDTypography from "components/MDTypography";

const TaskForm = ({ onCreateTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskErrors, setTaskErrors] = useState({});
  const [taskAdministrators, setTaskAdministrators] = useState([]);
  const [taskAdministratorsEmail, setAdministratorEmail] = useState('');

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  const [taskEmployees, setTaskEmployees] = useState([]);
  const [taskEmployeeEmail, setTaskEmployeeEmail] = useState('');

  const validateTaskFields = () => {
    let isValid = true;
    const newErrors = {};
  
    if (!taskName) {
      isValid = false;
      newErrors.taskName = 'Task Name is required';
    }
    if (!taskStatus) {
      isValid = false;
      newErrors.status = 'Task Status is required';
    }
  
    setTaskErrors(newErrors);
    return isValid;
  };

  const handleAddAdministrator = () => {
    if (taskAdministratorsEmail) {
      setTaskAdministrators([...taskAdministrators, taskAdministratorsEmail]);
      setAdministratorEmail(''); 
    }
  };
  const handleAddEmployee = () => {
    if (taskEmployeeEmail) {
      setTaskEmployees([...taskEmployees, taskEmployeeEmail]);
      setTaskEmployeeEmail(''); 
    }
  };

  const handleSubmit = () => {
    if (validateTaskFields()) {
      const newTask = {
        name: taskName,
        status: taskStatus,
        employees: taskEmployees, // Use 'taskEmployees' instead of 'selectedEmployees'
        admins: taskAdministrators, // Use 'taskAdministrators' instead of 'selectedAdmins'
      };
      onCreateTask(newTask);
    }
  };


  return (
    <MDBox>
      <MDInput
        label="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        error={!!taskErrors.taskName}
        helperText={taskErrors.taskName || ''}
      />
      <MDInput
        label="Task Status"
        value={taskStatus}
        onChange={(e) => setTaskStatus(e.target.value)}
        error={!!taskErrors.taskStatus}
        helperText={taskErrors.taskStatus || ''}
      />
      <MDBox>
        {taskAdministrators.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          label="Administrators"
          placeholder="Add Administrators"
          value={taskAdministratorsEmail}
          onChange={(e) => setAdministratorEmail(e.target.value)}
        />
        <MDButton onClick={handleAddAdministrator}>Add Admin</MDButton>
      </MDBox>
      <MDBox>
        {taskEmployees.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          label="Employees"
          placeholder="Add Employees"
          value={taskEmployeeEmail}
          onChange={(e) => setTaskEmployeeEmail(e.target.value)}
        />
        <MDButton onClick={handleAddEmployee}>Add Employee</MDButton>
      </MDBox>
    <MDButton onClick={handleSubmit}>Create Task</MDButton>
    </MDBox>
  );
};

export default TaskForm;
