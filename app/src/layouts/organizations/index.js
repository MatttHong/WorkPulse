/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import {useState, useEffect } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";


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
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import data from "layouts/projects/data/data/projectsTableData"
// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import AddOrganizationComponent from "./components/addOrganization";
import EditOrganizationForm from "./components/editOrganization";
import axios from "axios";

// Custom components for Projects Page
// import ProjectsComponent from "layouts/projects/components/ProjectsComponent";

function OrgsPage() {
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentOrg] = useState(null);
  const [menu, setMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [organizations, setProjects] = useState([]);
  const [editingOrg, setEditingOrg] = useState(null);
  

  

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    const BACKEND_ENDPOINT = 'http://localhost:3000/api/org';
    try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5MTI0MTcsImV4cCI6MTY5OTk0MTIxN30.x3aLW0kU0eZsa9LtPpWYwr-_5I-KzXJtVSbKr2RiVNc";
        const response = await axios.get(BACKEND_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        // Directly use response.data instead of response.json()
        const data = response.data;
        console.log("got orgs", data);
        setProjects(data.orgs); // Assuming the backend returns an object with an 'orgs' property
    } catch (error) {
        console.error('Error fetching organizations:', error);
    }
  };

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const handleOpenDialog = () => {

    setOpenDialog(true);
    closeMenu();
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const openOrgDetails = (org) => {
    setCurrentOrg(org);
    setOpen(true);
  };

  const openEditModal = (organization) => {
    setEditingOrg(organization);
  };
  
  const handleSaveEdit = async (updatedOrg) => {
    // ... close modal logic ...
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5MTI0MTcsImV4cCI6MTY5OTk0MTIxN30.x3aLW0kU0eZsa9LtPpWYwr-_5I-KzXJtVSbKr2RiVNc";
      const response = await axios.put(`http://localhost:3000/api/org/${updatedOrg._id}`, updatedOrg, {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
    const data = response.data;
    console.log('Organization Saved:', response.data);
    
      // Handle successful update
      fetchOrgs(); // Refresh the organization list
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const handleDelete = (orgId) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5MTI0MTcsImV4cCI6MTY5OTk0MTIxN30.x3aLW0kU0eZsa9LtPpWYwr-_5I-KzXJtVSbKr2RiVNc";
      axios.delete(`http://localhost:3000 /api/org/${orgId}`, {
        headers: {
            Authorization: "Bearer " + token,
        }
      })
        .then(response => {
          console.log("Organization deleted:", response.data);
          fetchOrgs();
          // Update your state to remove the deleted organization
          // This could be a state update or a re-fetch of the organization list
        })
        .catch(error => {
          console.error('Error deleting organization:', error);
        });
    }
  };


  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleOrganizationCreated = () => {
    handleCloseDialog();  // Close the dialog
    fetchOrgs();          // Refresh the organization list
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={handleOpenDialog}>New Organization</MenuItem>
    </Menu>
  );


  const columns = [
    { Header: "Organization Name", accessor: "organizationName" },
    { Header: "Actions", accessor: "actions" },
  ];

  // Map the organizations to rows for the DataTable
  const rows = organizations.map(organization => ({
    organizationName: organization.organizationName,
    
    actions: (
        <>
        <MDButton
          variant="outlined"
          color="info"
          onClick={() => openEditModal(organization)}
        >
          Edit
        </MDButton>
        <MDButton
          variant="outlined"
          color="error"
          onClick={() => handleDelete(organization._id)}
        >
          Delete
        </MDButton>
      </>
      ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            
          </Grid>
        </Grid>
      </MDBox>
      <Card>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Organizations
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
        </MDBox>
        {editingOrg && (
      <EditOrganizationForm
        organization={editingOrg}
        onSave={handleSaveEdit}
        onCancel={() => setEditingOrg(null)}
      />
    )}
    
        <MDBox>
            
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}

          />
         
          
        
          
        </MDBox>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Add New Organization</DialogTitle>
      <DialogContent>
        <AddOrganizationComponent 
          onAddOrg={handleOrganizationCreated} // Pass the callback
        />        
      </DialogContent>
      <MDButton onClick={handleCloseDialog} color="error">
        Cancel
      </MDButton>
    </Dialog>
     

      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default OrgsPage;
