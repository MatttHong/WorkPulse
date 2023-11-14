import { Edit } from "@mui/icons-material";
import {useState, useEffect} from "react"
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axios from "axios";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";

function EditOrganizationForm({ organization, onSave, onCancel }) {
    const [orgName, setOrgName] = useState(organization.orgName);
    const [orgEmail, setOrgEmail] = useState(organization.orgEmail);
    const [org, setOrg] = useState(organization.org);

    const [adminEmail, setAdminEmail] = useState(organization.adminEmail);
    const [project, setProject] = useState(organization.project);
    const [projectName, setProjectName] = useState(organization.projectName);
    const [employeeEmail, setEmployeeEmail] = useState(organization.projectName);
    const [employees, setEmployees] = useState(organization.employees);
    const [employee, setEmployee] = useState(organization.employee);

      // Add these to the state declarations within AddProjectComponent
const [openOrgDialog, setOpenOrgDialog] = useState(false);

const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

    const [emailToInvite, setEmailToInvite] = useState('');
    // ... other state variables for each field ...
  // Function to open the task dialog
const handleOpenOrgDialog = () => {
    setOpenOrgDialog(true);
  };
  
  // Function to close the task dialog
  const handleCloseOrgDialog = () => {
    setOpenOrgDialog(false);
  };

    const MembersList = () => (
        <ul>
          {employees.map((email, index) => (
            <li key={index}>
              {email}
              <button onClick={() => handleRemoveMember(email)}>Remove</button>
            </li>
          ))}
        </ul>
      );

      
      const handleAddEmployee = async () => {
        if (employeeEmail) {
            const userExists = await checkUserExists(employeeEmail);
            if (userExists) {
                setEmployees([...employees, employeeEmail]);
            } else {
                setEmailToInvite(employeeEmail);
                setOpenConfirmationDialog(true);
            }
            setEmployeeEmail('');
        }
    };


    // Remove member function
const handleRemoveMember = (email) => {
    setEmployees(employees.filter(memberEmail => memberEmail !== email));
    // Call API to update backend
  };
  
    const fetchEmployees = async () => {
        try {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5NzQ5OTIsImV4cCI6MTcwMDAwMzc5Mn0.d_-VdSLirHJePTPz-0OEGqvqwqyvYw8-wZ1chTlaAzE";
            const response = await axios.get('http://localhost:3000/api/employee' , {
                headers: {
                    Authorization: "Bearer " + token,
                }
        }
        );
        return response.data.employees;
        } catch (error) {
            console.error('Error fetching employees:', error);
            return [];
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, [organization]);


const handleSendInvitation = () => {
    sendInvitationEmail(emailToInvite);
    setOpenConfirmationDialog(false);
    setEmailToInvite('');
    // Add the email to the appropriate list (employee or admin)
  };



  const handleAddProject = () => {
    if (projectName) {
      setProject([...project, projectName]);
      setProjectName(''); 
    }
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
        <MDButton onClick={handleSendInvitation} color="success">
            Send Invitation
        </MDButton>
    </DialogActions>
</Dialog>
);

  const checkUserExists = async (email) => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5NzQ5OTIsImV4cCI6MTcwMDAwMzc5Mn0.d_-VdSLirHJePTPz-0OEGqvqwqyvYw8-wZ1chTlaAzE";
      const response = await axios.get(`http://localhost:3000/api/users/email/${email}`, {
      headers: {
        Authorization: "Bearer " + token
      }
        
      });
      if (response.status === 404) {
        return false; // User does not exist
      }
      return true; // User exists
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

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
    
    const handleSubmit = () => {
        
      // Prepare the data to be sent to the backend
      const updatedOrg = {
        ...organization,
        orgName,
        orgEmail,
        adminEmail
        // ... other updated fields ...
      };
      onSave(updatedOrg);
    };
  
    return (
      <div>
        <MDInput
          type="text"
          label="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <MDInput
          type="text"
          label="Organization Email"
          value={orgEmail}
          onChange={(e) => setOrgEmail(e.target.value)}
        />
       <MDInput
                type="text"
                label="Employee Email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
            />
            <MDButton onClick={handleAddEmployee}>Add Employee</MDButton>
            <ConfirmationDialog />
            <MembersList />
        
        {/* ... other input fields ... */}
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onCancel}>Cancel</button>

        <Dialog open={openOrgDialog} onClose={handleCloseOrgDialog}>
  
  <DialogTitle>Create Project</DialogTitle>
  <DialogContent>
  </DialogContent>
  <DialogActions>
    

    {org.map((org, index) => (
      <div key={index}>
      <p>{org.setOrgName}</p> 
      
      {/* ... Render other org details ... */}
    </div>
))}

  </DialogActions>
</Dialog>
<ConfirmationDialog />
      </div>
      
    );
  }
  
  export default EditOrganizationForm;
