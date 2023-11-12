import React, { useState } from 'react';
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import MDTypography from "components/MDTypography";

const OrgForm = ({ onCreateOrg }) => {
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskErrors, setTaskErrors] = useState({});
  const [taskAdministrators, setTaskAdministrators] = useState([]);
  const [taskAdministratorsEmail, setAdministratorEmail] = useState('');

  const [businessId, setBusinessId] = useState('');

  const [org, setOrg] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  const [taskEmployees, setTaskEmployees] = useState([]);
  const [taskEmployeeEmail, setTaskEmployeeEmail] = useState('');

  const validateOrgFields = () => {
    let isValid = true;
    const newErrors = {};
  
    if (!orgName) {
      isValid = false;
      newErrors.orgName = 'Task Name is required';

  
    setTaskErrors(newErrors);
    return isValid;
  };


  const handleSubmit = () => {
    if (validateOrgFields()) {
      const newOrg = {
        name: orgName,
      
      };
      onCreateOrg(newOrg);
    }
  };


  return (
    <MDBox>
      <MDInput
        label="Organization Name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        error={!!newErrors.orgName}
        helperText={newErrors.orgName || ''}
      />
      
    <MDButton onClick={handleSubmit}>Create Org</MDButton>
    </MDBox>
  );
  };
}

export default OrgForm;
