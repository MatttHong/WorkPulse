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
import axios from "axios"



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

const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
const [emailToInvite, setEmailToInvite] = useState('');
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


const handleAddEmployee = async () => {
  if (employeeEmail) {
    setEmployee([...employee, employeeEmail]);
    setEmployeeEmail(''); 
  }
};

const handleSendInvitation = () => {
  sendInvitationEmail(emailToInvite);
  setOpenConfirmationDialog(false);
  setEmailToInvite('');
  // Add the email to the appropriate list (employee or admin)
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

const handleAddProject = () => {
  if (projectName) {
    setProject([...project, projectName]);
    setProjectName(''); 
  }
};
  

const handleSubmit = (event) => {
 // event.preventDefault();
 if(validateFields){
  const orgData = {
    organizationName: orgName,
    organizationEmail: orgEmail,
    organizationAdministrators: admin, // Assuming 'admin' is an array of administrator emails
    employees: employee, // Assuming 'employee' is an array of employee emails
    imageLink: imageLink, // Assuming 'imageLink' is a string or an array of image links
    industry: industry, // Assuming 'industry' is an array of industry names
    projects: project, // Assuming 'project' is an array of project names
    departments: department, // Assuming 'department' is an array of department names
  };
  createOrganization(orgData);
  
 }else{
  console.log("Incorreect Field");
 }
  
};
//no duplicatge
const createOrganization = async (organizationData) => {
  try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5NzQ5OTIsImV4cCI6MTcwMDAwMzc5Mn0.d_-VdSLirHJePTPz-0OEGqvqwqyvYw8-wZ1chTlaAzE";
      const response = await axios.post('http://localhost:3000/api/org', organizationData, {
          headers: {
              Authorization: "Bearer " + token,
          }
      });
      const data = response.data;
      console.log('Organization created:', response.data);

      if (onAddOrg && typeof onAddOrg === 'function') {
        onAddOrg(data); // Assuming data contains the new organization details
      }
      // Additional logic like redirecting the user
  } catch (error) {
      console.error('Error creating organization:', error);
  }
};


// Validate input fields and update the errors state
const validateFields = async () => {
  let isValid = true;
  let newErrors = {};

  if (!orgName) {
    isValid = false;
    newErrors.orgName = 'Organization Name is required';
  }
  if (!orgEmail) {
    isValid = false;
    newErrors.orgEmail = 'Organization Email is required';
  }

  // // Validate Admin Emails
  // for (const email of admin) {
  //   const userExists = await checkUserExists(email);
  //   if (!userExists) {
  //     isValid = false;
  //     newErrors.adminEmail = `Admin email ${email} does not exist`;
  //     // Optionally trigger invitation email
  //     //sendInvitationEmail(email);
  //   }
  // }

  // // Validate Employee Emails
  // for (const email of employee) {
  //   const userExists = await checkUserExists(email);
  //   if (!userExists) {
  //     isValid = false;
  //     newErrors.employeeEmail = `Employee email ${email} does not exist`;
  //     // Optionally trigger invitation email
  //     //sendInvitationEmail(email);
  //   }
  // }

  setErrors(newErrors);
  return isValid;
};
const ConfirmationDialog = () => (
  <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
    <DialogTitle>Confirm Invitation</DialogTitle>
    <DialogContent>
      <MDTypography>
        The email {emailToInvite} does not exist. Do you want to send an invitation?
      </MDTypography>
    </DialogContent>
    <DialogActions>
      <MDButton onClick={() => setOpenConfirmationDialog(false)} color="error">
        Cancel
      </MDButton>
      <MDButton onClick={() => handleSendInvitation()} color="success">
        Send Invitation
      </MDButton>
    </DialogActions>
  </Dialog>
);


// Function to send invitation email
const sendInvitationEmail = async (email) => {
  const invitationData = {
    businessId: "1010101010",
    email: email,
    header: "header",
    body: "body",
};
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5NzQ5OTIsImV4cCI6MTcwMDAwMzc5Mn0.d_-VdSLirHJePTPz-0OEGqvqwqyvYw8-wZ1chTlaAzE";
const BACKEND_ENDPOINT = 'http://localhost:3000/api/invite';
try {
  const response = await fetch(BACKEND_ENDPOINT, {
    method: 'POST',
    headers: {
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(invitationData)
});
    const data = await response.json();
    console.log('Response:', data);
    // Handle the response: e.g., showing a success message
} catch (error) {
    // Log the error or display a message to the user
    console.error('Error sending invitation:', error);
}
};


  const handleCreateProject = (newProject) => {
    setAddedProjects([...addedProjects, newProject]); 
    handleCloseProjectDialog();
  };


  return (

    <form onSubmit={handleSubmit}>
      {Object.values(errors).map((error, index) => (
        <MDTypography key={index} color="error">{error}</MDTypography>
      ))}
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
        <MDInput
           label="Image Link"
           value={imageLink}
           onChange={(e) => setImageLink(e.target.value)}
           error={!!errors.imageLink}
           helperText={errors.imageLink || ''}
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
<ConfirmationDialog />
    </MDBox>
    </form>


  );
};


export default AddOrganizationComponent;


