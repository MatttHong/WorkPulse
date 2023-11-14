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

import {useState, useCallback} from "react";

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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/TasksOverview/data";
import TaskForm from "./addTask";



// const handleAddTask = async (taskData) => {
//   const BACKEND_ENDPOINT = 'http://localhost:3000/api/projects';
//
//   try {
//       const response = await fetch(BACKEND_ENDPOINT, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(taskData)
//       });
//
//       if (!response.ok) {
//         throw new Error('Network response was not ok: ' + response.statusText);
//       }
//       const data = await response.json();
//       console.log('Task added:', data);
//       // Close dialog and refresh projects list
//       handleCloseDialog();
//       // TODO: Refresh projects list here
//   } catch (error) {
//       console.error('Error adding task:', error);
//   }
// };

function Tasks() {
    const {columns, rows} = data();
    const [menu, setMenu] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);


    const openMenu = ({currentTarget}) => setMenu(currentTarget);
    const closeMenu = () => setMenu(null);

    const handleOpenDialog = () => {

        setOpenDialog(true);
        closeMenu();
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
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
            <MenuItem onClick={handleOpenDialog}>New Task</MenuItem>
        </Menu>
    );

    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <MDBox>
                    <MDTypography variant="h6" gutterBottom>
                        Tasks
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" lineHeight={0}>
                        <Icon
                            sx={{
                                fontWeight: "bold",
                                color: ({palette: {info}}) => info.main,
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
                    <Icon sx={{cursor: "pointer", fontWeight: "bold"}} fontSize="small" onClick={openMenu}>
                        more_vert
                    </Icon>
                </MDBox>
                {renderMenu}
            </MDBox>
            <MDBox>
                <DataTable
                    table={{columns, rows}}
                    showTotalEntries={false}
                    isSorted={false}
                    noEndBorder
                    entriesPerPage={false}
                />
            </MDBox>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create Task</DialogTitle>
                <DialogContent>
                    {/*<TaskForm onAddTask={handleAddTask}/>*/}
                </DialogContent>
                <MDButton onClick={handleCloseDialog} color="error">
                    Cancel
                </MDButton>
            </Dialog>
            <DialogActions>


            </DialogActions>
        </Card>
    );
}

export default Tasks;
