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
import OrgForm from "./orgForm"


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


function AddOrganizationComponent ({ onAddOrg }) {

  const [businessId, setBusinessId] = useState('');

  const [org, orgs] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [adminEmail, setAdminEmail] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [industryName, setIndustryName] = useState([]);

  const [project, setProject] = useState([]);
  const [projectName, setProjectName] = useState([]);

  const [department, setDepartment] = useState([]);
  const [departmentName, setDepartmentName] = useState([]);

  // Add these to the state declarations within AddProjectComponent
const [openProjectDialog, setOpenProjectDialog] = useState(false);

// State for error messages
const [errors, setErrors] = useState({});
const [addedProjects, setAddedProjects] = useState([]);

// Function to open the task dialog
const handleOpenProjectDialog = () => {
  setOpenProjectDialog(true);
};

// Function to close the task dialog
const handleCloseProjectDialog = () => {
  setOpenProjectDialog(false);
};

const handleAddAdmin = () => {
  if (adminEmail) {
    setAdmin([...admin, adminEmail]);
    setAdminEmail(''); 
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

const handleAddIndustry = () => {
  if (industryName) {
    setIndustry([...industry, industryName]);
    setIndustryName(''); 
  }
};

// const handleAddProject = () => {
//   if (projectName) {
//     setProject([...project, projectName]);
//     setProjectName(''); 
//   }
// };
  
 
  const handleSubmit = () => {
    
        const formData = {
          orgName,
          orgEmail,
          employee,
          admin,
          department,
          project,
          industry,
      };
      onAddOrg(formData);
  };


  


  // Validate input fields and update the errors state
  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    // // Add similar checks for other fields
    // if (!businessId) {
    //   isValid = false;
    //   newErrors.businessId = 'Business ID is required';
    // }
    if (!orgName) {
        isValid = false;
        newErrors.orgName = 'Organization Name is required';
    }
   

    setErrors(newErrors);
    return isValid;
  };


  const handleAddProject = (project) => {
    setAddedProjects([...addedProjects, project]);
  };

  const handleCreateProject = (newProject) => {
    setAddedProjects([...addedProjects, newProject]); 
    handleCloseProjectDialog();
  };


  return (
    <MDBox>
        
      <MDInput
           label="Organization Name"
           value={orgName}
           onChange={(e) => setOrgName(e.target.value)}
           error={!!errors.orgName}
           helperText={errors.orgName || ''}
        />
        <MDInput
           label="Organization Email"
           value={orgEmail}
           onChange={(e) => setOrgEmail(e.target.value)}
           error={!!errors.orgEmail}
           helperText={errors.orgEmail || ''}
        />
      <MDBox>
        {admin.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Administrator Email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <MDButton onClick={handleAddAdmin}>Add Admin</MDButton>
      </MDBox> 
      <MDBox>
        {employee.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Employee Email"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />
        <MDButton onClick={handleAddEmployee}>Add Employee</MDButton>
      </MDBox> 
        {/* department */}
      <MDBox>
        {department.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Departments"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <MDButton onClick={handleAddDepartment}>Add Department</MDButton>
      </MDBox> 
      
      <MDBox>
        {industry.map((email, index) => (
          <MDTypography key={index}>{email}</MDTypography>
        ))}
         <MDInput
          type="text"
          placeholder="Industry"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
        />
        <MDButton onClick={handleAddIndustry}>Add Industry</MDButton>
      </MDBox> 

      
      <MDButton onClick={handleSubmit} color="success">Create Organization</MDButton>
      <MDButton onClick={handleOpenProjectDialog}>Create Project</MDButton>

<Dialog open={openProjectDialog} onClose={handleCloseProjectDialog}>
  <DialogTitle>Create Project</DialogTitle>
  <DialogContent>
    {/* Pass the handleCreateTask function to the TaskForm */}
    <OrgForm onCreateProject={handleCreateProject} />
  </DialogContent>
  <DialogActions>
    <MDButton onClick={handleCloseProjectDialog} color="error">
      Cancel
    </MDButton>

    {org.map((org, index) => (
      <div key={index}>
      <p>{org.setOrgName}</p> 
      
      {/* ... Render other org details ... */}
    </div>
))}

  </DialogActions>
</Dialog>
    </MDBox>
  );
};


export default AddOrganizationComponent;


