import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useState } from "react";
import EditProjectComponent from "layouts/projects/components/editProject"; // Make sure this path is correct

const ProjectDetails = ({ open, onClose, project, onProjectUpdate }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (!project) {
    return null; // or some loading indicator
  }

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  // This function is called when the project is successfully updated
  const handleProjectUpdated = (updatedProject) => {
    // Call the onProjectUpdate prop with the updated project
    onProjectUpdate(updatedProject);
    // Close the edit dialog
    handleCloseEditDialog();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{project.name}</DialogTitle>
        <DialogContent>
          <MDBox>
            <MDTypography variant="body1">Status: {project.status}</MDTypography>
            {/* Display other project details */}
            {project.tasks?.map((task, index) => (
              <MDBox key={index}>
                <MDTypography variant="body2">{task.name}</MDTypography>
                {/* Display other task details */}
              </MDBox>
            ))}
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleOpenEditDialog}>Edit Project</MDButton>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <EditProjectComponent project={project} onSave={handleProjectUpdated} />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseEditDialog} color="error">
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectDetails;
