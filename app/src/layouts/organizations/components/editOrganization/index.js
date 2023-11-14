import { Edit } from "@mui/icons-material";
import {useState} from "react"

function EditOrganizationForm({ organization, onSave, onCancel }) {
    const [organizationName, setOrganizationName] = useState(organization.organizationName);
    // ... other state variables for each field ...
  
    const handleSubmit = () => {
      // Prepare the data to be sent to the backend
      const updatedOrg = {
        ...organization,
        organizationName,
        // ... other updated fields ...
      };
      onSave(updatedOrg);
    };
  
    return (
      <div>
        <input
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
        />
        {/* ... other input fields ... */}
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  }
  
  export default EditOrganizationForm;