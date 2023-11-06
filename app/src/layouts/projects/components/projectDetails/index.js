
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MDBox from "components/MDBox";
// import EditProjectComponent from "../editProject";
import { Card } from "react-bootstrap";

const ProjectDetails = ({ open, onClose, project }) => {


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{project?.name}</DialogTitle>
      <DialogContent>
        {/* <MDBox>
        {project?.tasks?.map((task, index) => (
          <MDBox key={index}>{task.name}</MDBox>
        ))}
        </MDBox> */}
       <MDBox>
       
       </MDBox>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetails;
