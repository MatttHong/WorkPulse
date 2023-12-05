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
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios"

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import ProjectDetails from "layouts/projects/components/projectDetails";
import AddProjectComponent from "./components/addProject";


function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [menu, setMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk4NDMyOTEsImV4cCI6MTY5OTg3MjA5MX0.refMWOUKBdRHyLUqi0l8NuGKj5Du_dmiFkEXya4DuRU";
      const BACKEND_ENDPOINT = 'http://localhost:3000/api/proj';
      const response = await axios.get(BACKEND_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("TEST WORKS");
      setProjects(data); // Assuming the backend returns an array of projects
    } catch (error) {
      console.error('Error fetching projects:', error);
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

  const openProjectDetails = (project) => {
    setCurrentProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      <MenuItem onClick={handleOpenDialog}>New Project</MenuItem>
    </Menu>
  );

  const handleAddProject = async (projectData) => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk4NDMyOTEsImV4cCI6MTY5OTg3MjA5MX0.refMWOUKBdRHyLUqi0l8NuGKj5Du_dmiFkEXya4DuRU";
      const BACKEND_ENDPOINT = 'http://localhost:3000/api/proj';
      const response = await axios.post(BACKEND_ENDPOINT, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        });

      const data = await response.json();
      console.log('Project added:', data);
        // Close dialog and refresh projects list
        handleCloseDialog();// Assuming the backend returns an array of projects
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Status", accessor: "status" },
    // ... other column definitions ...
  ];

  const rows = projects.map((project) => {
    return {

      name: project.name,
      status: project.status,
      tasks: project.tasks.length, 
      
      actions: (
        <MDButton
          variant="outlined"
          color="info"
          onClick={() => openProjectDetails(project)}
        >
          View Details
        </MDButton>
      ),
    };
  });
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
            Projects
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
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>30 done</strong> this month
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
        </MDBox>
        <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      <MDBox>
      <DataTable
  table={{
    columns: columns,
    rows: rows
  }}
  
/>
      </MDBox>
      </MDBox>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <AddProjectComponent onAddProject={handleAddProject} />        
        </DialogContent>
        <MDButton onClick={handleCloseDialog} color="error">
        Cancel
        </MDButton>
      </Dialog>
      <MDBox>
       <ProjectDetails open={open} onClose={handleClose} project={currentProject} />
      </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default ProjectsPage;
