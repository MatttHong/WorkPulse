import {useState, useEffect} from "react";


import Card from "@mui/material/Card";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button} from '@mui/material';


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

import axios from "axios";
import Tooltip from '@mui/material/Tooltip';
import Checkbox from "@mui/material/Checkbox";

function Organizations() {
    // data vars
    const token = localStorage.getItem("token");
    const [employeeID, setEmployeeID] = useState("");
    const [orgaId, setOrgaId] = useState("");
    const [userOrganization, setUserOrganization] = useState([]);
    const [adminEmployees, setAdminEmployees] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [nonAdminEmployees, setNonAdminEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [dummyOrg, setDummyOrg] = useState([]);

    // data funcs
    const fetchUserData = async () => {
        const userEmail = localStorage.getItem("email");
        const response = await axios.get(`http://localhost:3000/api/users/email/${userEmail}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
        return response.data;
    };

    const fetchOrgID = async (employeeID) => {
        const response = await axios.get(`http://localhost:3000/api/employee/${employeeID}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
        return response.data;
    };

    const fetchOrg = async (orgId) => {
        const response = await axios.get(`http://localhost:3000/api/org/${orgId}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
        return response.data;
    };

    const fetchEmployee = async (employeeId) => {
        const response = await fetch(`http://localhost:3000/api/employee/${employeeId}`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("Error fetching employee data: ", response.statusText);
            return null;
        }

        const employeeData = await response.json();
        return employeeData.employee;
    };

    const fetchData = async () => {
        try {
            const userData = await fetchUserData();
            if (userData.status === "Success") {
                const employeeID = userData.user.employments[0];
                setEmployeeID(employeeID);

                const employeeData = await fetchOrgID(employeeID);
                if (employeeData.employee) {
                    const organizationId = employeeData.employee.orgId;

                    setOrgaId(organizationId);

                    const orgInfo = await fetchOrg(orgaId);
                    if (orgInfo.orgs) {
                        setUserOrganization(orgInfo.orgs[0]);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const fetchAdministrators = async () => {
        const adminIds = userOrganization.organizationAdministrators;
        const adminUsers = [];
        const adminEmps = [];

        for (const id of adminIds) {
            const employeeResponse = await fetch(`http://localhost:3000/api/employee/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            });

            if (!employeeResponse.ok) {
                console.error("Error fetching employee data: ", employeeResponse.statusText);
                continue;
            }

            const employeeData = await employeeResponse.json();
            adminEmps.push(employeeData.employee);

            const userId = employeeData.employee.userId;

            const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            });

            if (!userResponse.ok) {
                console.error("Error fetching user data: ", userResponse.statusText);
                continue;
            }

            const userData = await userResponse.json();
            adminUsers.push(userData.user);
        }

        setAdminUsers(adminUsers);
        setAdminEmployees(adminEmps);
    };

    const fetchNonAdminEmployees = async () => {
        if (userOrganization && userOrganization.employees && userOrganization.organizationAdministrators) {
            const employeeDetailsPromises = userOrganization.employees
                .filter(empId => !userOrganization.organizationAdministrators.includes(empId))
                .map(empId => fetchEmployee(empId));

            try {
                const employeeDetails = await Promise.all(employeeDetailsPromises);

                const nonAdminEmployees = employeeDetails.filter(employee => employee !== null);

                setNonAdminEmployees(nonAdminEmployees);
            } catch (error) {
                console.error("Error fetching non-admin employees: ", error);
            }
        }
    };


    const fetchDepartments = async () => {
        const departmentIds = userOrganization.departments;
        const departmentList = [];

        for (const id of departmentIds) {
            const departmentResponse = await fetch(`http://localhost:3000/api/dep/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            });

            if (!departmentResponse.ok) {
                console.error("Error fetching department data: ", departmentResponse.statusText);
                continue;
            }

            const departmentData = await departmentResponse.json();
            const departmentAdmins = [];
            const departmentProjects = [];

            // Fetch each administrator of the department
            for (const adminId of departmentData.dept.departmentAdministrators) {
                const adminData = await fetchEmployee(adminId);
                if (adminData) {
                    departmentAdmins.push(adminData);
                }
            }

            // Fetch each project of the department
            for (const projId of departmentData.dept.projects) {
                const projectResponse = await fetch(`http://localhost:3000/api/proj/${projId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': "Bearer " + token,
                        'Content-Type': 'application/json'
                    }
                });

                if (!projectResponse.ok) {
                    console.error("Error fetching project data: ", projectResponse.statusText);
                    continue;
                }

                const projectData = await projectResponse.json();
                const projectAdmins = [];
                const projectEmployees = [];

                // Fetch project administrators as employee objects
                for (const adminId of projectData.project.projectAdministrators) {
                    const adminData = await fetchEmployee(adminId);
                    if (adminData) {
                        projectAdmins.push(adminData);
                    }
                }

                // Fetch employees as employee objects
                for (const employeeId of projectData.project.employees) {
                    const employeeData = await fetchEmployee(employeeId);
                    if (employeeData) {
                        projectEmployees.push(employeeData);
                    }
                }

                departmentProjects.push({
                    ...projectData.project,
                    projectAdministrators: projectAdmins,
                    employees: projectEmployees
                });
            }

            departmentList.push({
                ...departmentData.dept,
                admins: departmentAdmins,
                projects: departmentProjects
            });
        }

        setDepartments(departmentList);
    };

    useEffect(() => {
        fetchData();
        if (userOrganization && userOrganization.organizationAdministrators && userOrganization.departments) {
            fetchAdministrators();
            fetchDepartments();
            fetchNonAdminEmployees();
        }
        //here
    }, [userOrganization]);

    console.log("employeeID:", employeeID);
    console.log("orgaID:", orgaId);
    console.log("userOrganization:", userOrganization);
    console.log("Departments:", departments);
    console.log("ADMIN EMPLOYEES:", adminEmployees);
    console.log("NONADMIN EMPLOYEES:", nonAdminEmployees);
    console.log("*****************************");

    // visual vars
    const [editMode, setEditMode] = useState(false);
    const [adminEditMode, setAdminEditMode] = useState(false);
    const [deptEditMode, setDeptEditMode] = useState(false);
    const [projectEditMode, setProjectEditMode] = useState(false);
    const [editDept, setEditDept] = useState(undefined);
    const [editProject, setEditProject] = useState(undefined);
    const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
    const [isAddDeptDialogOpen, setIsAddDeptDialogOpen] = useState(false);
    const [isEditDeptDialogOpen, setIsEditDeptDialogOpen] = useState(false);
    const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
    const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
    const [addAdminSelectedEmail, setAddAdminSelectedEmail] = useState(null);
    const [addDeptSelectedEmail, setAddDeptSelectedEmail] = useState(null);
    const [editDeptSelectedEmail, setEditDeptSelectedEmail] = useState(null);
    const [addProjectSelectedEmail, setAddProjectSelectedEmail] = useState(null);
    const [addProjectSelectedDept, setAddProjectSelectedDept] = useState(null);
    const [addProjectSelectedTeam, setAddProjectSelectedTeam] = useState([]);
    const [addAdminSelectionWarning, setAddAdminSelectionWarning] = useState("");
    const [addDeptSelectionWarning, setAddDeptSelectionWarning] = useState("");
    const [editDeptSelectionWarning, setEditDeptSelectionWarning] = useState("");
    const [addProjectSelectionWarning, setAddProjectSelectionWarning] = useState("");
    const [addDeptNewDeptName, setAddDeptNewDeptName] = useState("");
    const [addProjectNewProjectName, setAddProjectNewProjectName] = useState("");


    // visual funcs
    const handleEditOrgClick = () => {
        setDummyOrg({...userOrganization});
        setEditMode(true);
    };

    const handleEditOrgSave = async () => {
        try {
            console.log("DUMMY ORG:", dummyOrg);
            const response = await axios.put(`http://localhost:3000/api/org/${dummyOrg._id}`, dummyOrg, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setUserOrganization(dummyOrg);
                setEditMode(false);
                console.log("Organization Details updated successfully.")
            } else {
                setDummyOrg(userOrganization);
            }
        } catch (error) {
            console.error("Error updating organization data:", error);
        }
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setDummyOrg(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleAdminEditClick = () => {
        setAdminEditMode(true);
    };

    const handleDeptEditClick = () => {
        setDeptEditMode(true);
    };

    const handleProjectEditClick = () => {
        setProjectEditMode(true);
    }

    const handleAddAdminClick = async () => {
        setIsAddAdminDialogOpen(true);
    };

    const handleAddDeptClick = async () => {
        setIsAddDeptDialogOpen(true);
    };

    const handleAddProjectClick = async () => {
        setIsAddProjectDialogOpen(true);
    }

    const handleEditSingleDeptClick = (selectedDepartment) => {
        console.log("Department being edited before:", selectedDepartment);
        setEditDept(selectedDepartment);
        console.log("Department being edited after:", editDept);
        setIsEditDeptDialogOpen(true);
    }

    const handleEditSingleProjectClick = (selectedProject) => {
        console.log("Project being edited before:", selectedProject);
        setEditDept(selectedProject);
        console.log("Project being edited after:", editProject);
        setIsEditProjectDialogOpen(true);
    }

    const handleAddAdminEditToggle = () => {
        setAdminEditMode(false);
    };

    const handleAddDeptEditToggle = () => {
        setDeptEditMode(false);
    };

    const handleAddProjectEditToggle = () => {
        setProjectEditMode(false);
    }

    const handleAddAdminSelectEmail = (email) => {
        setAddAdminSelectedEmail(email);
    };

    const handleAddDeptSelectEmail = (email) => {
        setAddDeptSelectedEmail(email);
    }

    const handleEditDeptSelectEmail = (email) => {
        setEditDeptSelectedEmail(email);
    }

    const handleAddProjectSelectEmail = (email) => {
        setAddProjectSelectedEmail(email);
    }

    const handleAddProjectSelectDept = (dept) => {
        setAddProjectSelectedDept(dept);
    }

    const handleAddDeptNameChange = (event) => {
        setAddDeptNewDeptName(event.target.value);
    };

    const handleAddProjectNameChange = (event) => {
        setAddProjectNewProjectName(event.target.value);
    }

    const handleAddAdminConfirm = async () => {
        setAddAdminSelectionWarning("");

        if (!addAdminSelectedEmail) {
            setAddAdminSelectionWarning("Please select an employee to add as an administrator.");
            return;
        }

        const selectedEmployee = nonAdminEmployees.find(emp => emp.email === addAdminSelectedEmail);

        if (selectedEmployee) {
            const updatedAdmins = [...userOrganization.organizationAdministrators, selectedEmployee._id];
            setUserOrganization(prevState => ({
                ...prevState,
                organizationAdministrators: updatedAdmins
            }));

            try {
                const response = await fetch(`http://localhost:3000/api/org/${userOrganization._id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({organizationAdministrators: updatedAdmins})
                });

                if (!response.ok) {
                    setAddAdminSelectionWarning('Failed to add new administrator. Please try again.');
                    return;
                }

                setIsAddAdminDialogOpen(false);
            } catch (error) {
                console.error('Error adding new department: ', error);
                setAddAdminSelectionWarning('An error occurred while adding the new administrator. Please try again.');
                setUserOrganization(prevState => ({
                    ...prevState,
                    organizationAdministrators: prevState.organizationAdministrators.slice(0, -1)
                }));
            }
        }
    };

    const handleAddDeptConfirm = async () => {
        setAddDeptSelectionWarning("");

        if (!addDeptNewDeptName) {
            setAddDeptSelectionWarning("Please enter a name for new department.");
            return;
        }

        if (!addDeptSelectedEmail) {
            setAddDeptSelectionWarning("Please select an employee to add as an administrator.");
            return;
        }

        const selectedEmployee = [...adminEmployees, ...nonAdminEmployees].find(emp => emp.email === addDeptSelectedEmail);

        console.log("**********JSON:", selectedEmployee._id);
        console.log("SELECTED EMPLOYEE:", selectedEmployee);

        if (!selectedEmployee) {
            setAddDeptSelectionWarning("Selected administrator not found.");
            return;
        }

        const newDep = {
            departmentName: addDeptNewDeptName,
            departmentAdministrators: [selectedEmployee._id]
        };

        try {
            let response = await fetch("http://localhost:3000/api/dep", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDep)
            });

            console.log("RESPONSE!!!!!!!!!!!!!:", response);

            if (!response.ok) {
                setAddDeptSelectionWarning('Failed to add new department. Please try again.');
                return;
            }

            const newDeptData = await response.json();

            console.log("NEWDEPTDATA!!!!!!!!!!!!!:", newDeptData);

            const updatedDepartments = [...userOrganization.departments, newDeptData.dept._id];
            setUserOrganization(prevState => ({
                ...prevState,
                departments: updatedDepartments
            }));

            response = await fetch(`http://localhost:3000/api/org/${userOrganization._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({departments: updatedDepartments})
            });

            if (!response.ok) {
                setAddAdminSelectionWarning('Failed to add new department. Please try again.');
                return;
            }

            setIsAddDeptDialogOpen(false);
        } catch (error) {
            console.error('Error updating organization departments: ', error);
            setAddDeptSelectionWarning('An error occurred while updating the organization departments. Please try again.');
            setUserOrganization(prevState => ({
                ...prevState,
                organizationAdministrators: prevState.organizationAdministrators.slice(0, -1)
            }));
        }
    };

    const handleEditDeptConfirm = async () => {
        setEditDeptSelectionWarning("");

        if (!editDeptSelectedEmail) {
            setEditDeptSelectionWarning("Please select an employee to add as an administrator.");
            return;
        }

        const selectedEmployee = [...adminEmployees, ...nonAdminEmployees].find(emp => emp.email === editDeptSelectedEmail);

        console.log("**********JSON:", selectedEmployee._id);
        console.log("SELECTED EMPLOYEE:", selectedEmployee);

        if (!selectedEmployee) {
            setAddDeptSelectionWarning("Selected administrator not found.");
            return;
        }

        const newAdmins = {
            departmentAdministrators: [...editDept.departmentAdministrators, selectedEmployee._id]
        };

        try {
            let response = await fetch(`http://localhost:3000/api/dep/${editDept._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAdmins)
            });

            console.log("RESPONSE!!!!!!!!!!!!!:", response);

            if (!response.ok) {
                setAddDeptSelectionWarning('Failed to update the department. Please try again.');
                return;
            }

            fetchData();
            if (userOrganization && userOrganization.organizationAdministrators && userOrganization.departments) {
                fetchAdministrators();
                fetchDepartments();
                fetchNonAdminEmployees();
            }

            setIsEditDeptDialogOpen(false);
        } catch (error) {
            console.error('Error updating department: ', error);
        }
    };

    const handleEditDeptRemoveConfirm = async () => {
        setEditDeptSelectionWarning("");

        if (!editDeptSelectedEmail) {
            setEditDeptSelectionWarning("Please select an employee to add as an administrator.");
            return;
        }

        const selectedEmployee = [...adminEmployees].find(emp => emp.email === editDeptSelectedEmail);
        if (!selectedEmployee) {
            setEditDeptSelectionWarning("Please select an employee who is a department admin to remove.");
            return;
        }
        console.log("ADMIN TO BE REMOVED:", selectedEmployee);


        const newAdmins = {
            departmentAdministrators: editDept.departmentAdministrators.filter(id => id !== selectedEmployee._id)
        };

        try {
            let response = await fetch(`http://localhost:3000/api/dep/${editDept._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAdmins)
            });

            console.log("RESPONSE!!!!!!!!!!!!!:", response);

            if (!response.ok) {
                setAddDeptSelectionWarning('Failed to update the department. Please try again.');
                return;
            }

            fetchData();
            if (userOrganization && userOrganization.organizationAdministrators && userOrganization.departments) {
                fetchAdministrators();
                fetchDepartments();
                fetchNonAdminEmployees();
            }

            setIsEditDeptDialogOpen(false);
        } catch (error) {
            console.error('Error updating department: ', error);
        }
    }

    const handleAddProjectTeamToggle = (email) => {
        const currentIndex = addProjectSelectedTeam.indexOf(email);
        const newAddProjectTeam = [...addProjectSelectedTeam];

        if (currentIndex === -1) {
            newAddProjectTeam.push(email);
        } else {
            newAddProjectTeam.splice(currentIndex, 1);
        }

        setAddProjectSelectedTeam(newAddProjectTeam);
    };

    const handleAddProjectConfirm = async () => {
        setAddProjectSelectionWarning("");

        if (!addProjectNewProjectName) {
            setAddDeptSelectionWarning("Please enter a name for new project.");
            return;
        }

        if (!addProjectSelectedDept) {
            setAddDeptSelectionWarning("Please select a department for new project.");
            return;
        }

        if (!addProjectSelectedEmail) {
            setAddProjectSelectionWarning("Please select an employee to add as an administrator.");
            return;
        }

        if (!addProjectSelectedTeam) {
            setAddProjectSelectionWarning("Please select employees to add to new project.");
        }

        const allEmployees = [...adminEmployees, ...nonAdminEmployees];
        const selectedAdminEmployee = allEmployees.find(emp => emp.email === addProjectSelectedEmail);
        const selectedEmployees = allEmployees.filter(emp => addProjectSelectedTeam.includes(emp.email));
        console.log("SELECTED ADMIN EMPLOYEE:", selectedAdminEmployee);
        console.log("SELECTED EMPLOYEES:", selectedEmployees);

        if (!selectedAdminEmployee) {
            setAddDeptSelectionWarning("Selected administrator not found.");
            return;
        }

        if (!selectedEmployees) {
            setAddDeptSelectionWarning("Selected employees could not found.");
            return;
        }

        const newProject = {
            projectName: addProjectNewProjectName,
            projectAdministrators: [selectedAdminEmployee._id],
            employees: selectedEmployees.map(emp => emp._id),
            departments: addProjectSelectedDept._id
        };

        try {
            let addProjectResponse = await fetch("http://localhost:3000/api/proj", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProject)
            });

            console.log("NEW PROJECT RESPONSE:", addProjectResponse);

            if (!addProjectResponse.ok) {
                setAddDeptSelectionWarning('Failed to add new project. Please try again.');
                return;
            }

            const newProjectData = await addProjectResponse.json();
            console.log("NEW PROJECT DATA:", newProjectData);

            const updatedDept = {
                projects: [...addProjectSelectedDept.projects, newProjectData.project._id]
            };

            let updateDepartmentResponse = await fetch(`http://localhost:3000/api/dep/${addProjectSelectedDept._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedDept)
            });

            if (!updateDepartmentResponse.ok) {
                setAddDeptSelectionWarning('Failed to update related department while adding the project. Please try again.');
                return;
            }

            setAddProjectNewProjectName("");
            setAddProjectSelectedEmail("");
            setAddProjectSelectedTeam([]);

            fetchData();
            if (userOrganization && userOrganization.organizationAdministrators && userOrganization.departments) {
                fetchAdministrators();
                fetchDepartments();
                fetchNonAdminEmployees();
            }

            setIsAddProjectDialogOpen(false);
        } catch (error) {
            console.error('Error creating a projects: ', error);
            setAddDeptSelectionWarning('An error occurred while creating a new project. Please try again.');
            setUserOrganization(prevState => ({
                ...prevState,
            }));
        }
    };

    const handleRemoveAdmin = async (adminId) => {
        const updatedAdmins = userOrganization.organizationAdministrators.filter(id => id !== adminId);
        setUserOrganization(prevState => ({
            ...prevState,
            organizationAdministrators: updatedAdmins
        }));

        try {
            const response = await fetch(`http://localhost:3000/api/org/${userOrganization._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({organizationAdministrators: updatedAdmins})
            });

            if (!response.ok) {
                throw new Error('Failed to remove administrator');
            }

        } catch (error) {
            console.error('Error removing administrator: ', error);
            setUserOrganization(prevState => ({
                ...prevState,
                organizationAdministrators: [...prevState.organizationAdministrators, adminId]
            }));
        }
    };

    const handleRemoveDept = async (deptId) => {
        const updatedDepts = userOrganization.departments.filter(id => id !== deptId);
        setUserOrganization(prevState => ({
            ...prevState,
            departments: updatedDepts
        }));

        try {
            const deleteResponse = await fetch(`http://localhost:3000/api/dep/${deptId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!deleteResponse.ok) {
                throw new Error('Failed to remove department');
            }

            const updateOrgResponse = await fetch(`http://localhost:3000/api/org/${userOrganization._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({departments: updatedDepts})
            });

            if (!updateOrgResponse.ok) {
                throw new Error('Failed to remove department');
            }

        } catch (error) {
            console.error('Error removing department: ', error);
            setUserOrganization(prevState => ({
                ...prevState,
                departments: [...prevState.organizationAdministrators, deptId]
            }));
        }
    };

    const handleRemoveProject = async (projId, deptId) => {
        console.log("PROJECT ID:", projId);
        console.log("DEPARTMENT ID:", deptId);
        console.log("DEPARTMENTS:", departments);
        const projectDept = departments.find(department => department._id === deptId);
        console.log("PROJECT DEPARTMENT:", projectDept);

        const updatedProjects = projectDept.projects.filter(project => project._id !== projId);

        // Delete project
        const deleteProjResponse = await fetch(`http://localhost:3000/api/org/${projId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!deleteProjResponse.ok) {
            console.log("There is a problem deleting a project:", deleteProjResponse);
        }

        // Update department
        const updateDeptResponse = await fetch(`http://localhost:3000/api/dep/${deptId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({projects: updatedProjects})
        });

        if (!updateDeptResponse.ok) {
            console.log("There is a problem updating the dept after deleting the project:", updateDeptResponse);
        }

        fetchData();
        if (userOrganization && userOrganization.organizationAdministrators && userOrganization.departments) {
            fetchAdministrators();
            fetchDepartments();
            fetchNonAdminEmployees();
        }
    };

    const EmailList = ({ admins }) => {
        // Check if admins is an array and has elements
        const isValidArray = Array.isArray(admins) && admins.length;

        return (
            <div>
                {isValidArray && admins.length > 2 && (
                    <>
                        <input type="checkbox" id="toggleEmails" className="email-toggle" />
                        <label htmlFor="toggleEmails">• Expand</label>
                    </>
                )}
                <ul style={{ listStyleType: 'none' }}>
                    {isValidArray ? (
                        admins.map((admin, index) => {
                            const email = typeof admin === 'string' ? admin : admin.email;
                            return (
                                <li key={email} className={`email-item ${index >= 2 ? 'hidden' : ''}`}>
                                    {email}
                                </li>
                            );
                        })
                    ) : (
                        <li>No emails available</li>
                    )}
                </ul>

                <style>
                    {`
                      .hidden {
                        display: none;
                      }
                      .email-toggle:checked + label + ul .hidden {
                        display: list-item;
                      }
                      .email-toggle {
                        display: none;
                      }
                      /* Optional: style for 'Show More' label */
                      label[for="toggleEmails"] {
                        cursor: pointer;
                        color: frey;
                        font-weight: bold;
                      }
                    `}
                </style>
            </div>
        );
    };

    return (
        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3.5}>
                <MDBox>
                    {editMode ? (
                        <>
                            <TextField
                                value={dummyOrg.organizationName}
                                name="organizationName"
                                label={<MDTypography fontWeight={"bold"}
                                                     sx={{color: 'grey', fontSize: '1rem'}}>Name</MDTypography>}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{marginBottom: '8px'}}
                                fullWidth
                            />
                            <TextField
                                value={dummyOrg.organizationEmail}
                                name="organizationEmail"
                                label={<MDTypography fontWeight={"bold"}
                                                     sx={{color: 'grey', fontSize: '1rem'}}>Email</MDTypography>}
                                onChange={handleInputChange}
                                variant="outlined"
                                variant="outlined"
                                sx={{marginBottom: '8px'}}
                                fullWidth
                            />
                            <MDBox>
                                <TextField
                                    value={dummyOrg.industry}
                                    name="industry"
                                    label={<MDTypography fontWeight={"bold"}
                                                         sx={{color: 'grey', fontSize: '1rem'}}>Industry</MDTypography>}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                />
                            </MDBox>
                        </>
                    ) : (
                        <>
                            <MDTypography variant="h6" gutterBottom>
                                {userOrganization.organizationName}
                            </MDTypography>
                            <MDTypography variant="button" fontWeight={"light"} color="text">
                                &nbsp;{userOrganization.organizationEmail}
                            </MDTypography>
                            <MDBox>
                                <MDTypography variant="button" fontWeight="regular" color="text">
                                    &nbsp;{userOrganization.industry}
                                </MDTypography>
                            </MDBox>
                        </>
                    )}
                </MDBox>
                <IconButton onClick={editMode ? handleEditOrgSave : handleEditOrgClick}>
                    {editMode ? <SaveIcon sx={{fontSize: 'medium !important'}}/> :
                        <EditIcon sx={{fontSize: 'medium !important'}}/>}
                </IconButton>
            </MDBox>

            <Dialog sx={{'& .MuiDialog-paper': {minWidth: '700px'}}} open={isAddAdminDialogOpen}
                    onClose={() => setIsAddAdminDialogOpen(false)}>
                <DialogTitle sx={{lineHeight: "2", textAlign: "center"}}>Add New Administrator</DialogTitle>
                <DialogContent>
                    <MDTypography variant="subtitle2" sx={{textAlign: "center"}}>
                        Please select an employee to assign as an administrator.
                    </MDTypography>
                </DialogContent>
                <MDBox display="flex" flexDirection="column" alignItems="center">
                    <MDBox width="50%" bgcolor="background.paper" maxHeight={300} overflow="auto" sx={{margin: 'auto'}}>
                        <List sx={{width: '100%', mb: 2}}>
                            {Array.isArray(adminEmployees) && Array.isArray(nonAdminEmployees) ? [...adminEmployees, ...nonAdminEmployees].map((employee) => (
                                <ListItem
                                    button
                                    key={employee.id}
                                    onClick={() => handleAddAdminSelectEmail(employee.email)}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: employee.email === addAdminSelectedEmail ? '#e0e0e0' : 'transparent',
                                        justifyContent: 'center',
                                        mx: 'auto'
                                    }}
                                >
                                    <ListItemText primary={employee.email} sx={{
                                        textAlign: 'center',
                                        '& .MuiListItemText-primary': {fontSize: '1rem', padding: '2px'}
                                    }}/>
                                </ListItem>
                            )) : 'Something unexpected happened while fetching organization employees.'}
                        </List>
                    </MDBox>
                    {addAdminSelectedEmail && (
                        <MDTypography variant="body2" style={{margin: '20px 0'}}>
                            {addAdminSelectedEmail} will be added as an administrator
                        </MDTypography>
                    )}
                    {addAdminSelectionWarning && (
                        <MDTypography variant="body2" sx={{color: 'red', textAlign: 'center', mt: 2}}>
                            {addAdminSelectionWarning}
                        </MDTypography>
                    )}
                    <MDButton onClick={handleAddAdminConfirm} color="info" variant="contained"
                              sx={{color: 'white', mt: 2, mb: 2}}>
                        OK
                    </MDButton>
                </MDBox>
            </Dialog>
            <MDBox display="flex" flexDirection="column">
                <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                    <MDTypography
                        variant="button"
                        fontWeight="medium"
                        color="text"
                    >
                        &nbsp; Organization Administrators
                    </MDTypography>
                    {adminEditMode ? (
                        <>
                            <MDTypography>
                                <IconButton
                                    onClick={handleAddAdminEditToggle}
                                    sx={{padding: 0}}
                                >
                                    <SaveIcon sx={{fontSize: 'medium !important'}}/>
                                </IconButton>
                            </MDTypography>
                            <MDTypography sx={{padding: '0 !important'}}>
                                <IconButton
                                    onClick={handleAddAdminClick}
                                    sx={{padding: '0 !important'}}
                                >
                                    <AddIcon sx={{fontSize: 'medium !important'}}/>
                                </IconButton>
                            </MDTypography>
                        </>
                    ) : (
                        <IconButton
                            onClick={handleAdminEditClick}
                            sx={{padding: 0}}
                        >
                            <EditIcon sx={{fontSize: 'medium !important'}}/>
                        </IconButton>
                    )}
                </MDBox>

                <DataTable
                    table={{
                        columns: [
                            {Header: "Name", accessor: "name", align: "left"},
                            {Header: "Email", accessor: "email", align: "left"},
                            {Header: "", accessor: "actions", align: "center"}
                        ],
                        rows: adminUsers.map((adminUser, index) => {
                            const adminEmployee = adminEmployees[index];
                            return {
                                name: (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        {adminUser.firstName} {adminUser.lastName}
                                    </MDTypography>
                                ),
                                email: adminEmployee ? (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        {adminEmployee.email}
                                    </MDTypography>
                                ) : null,
                                actions: adminEditMode ? (
                                    <IconButton
                                        onClick={() => handleRemoveAdmin(adminEmployee._id)}
                                        sx={{padding: 0}}
                                    >
                                        <RemoveCircleOutlineIcon sx={{fontSize: 'medium !important'}}/>
                                    </IconButton>
                                ) : null,
                            };
                        }),
                    }}
                    showTotalEntries={false}
                    isSorted={false}
                    noEndBorder
                    entriesPerPage={false}
                />
            </MDBox>
            <MDBox display="flex" flexDirection="column">
                <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                    <MDTypography
                        variant="button"
                        fontWeight="medium"
                        color="text"
                    >
                        &nbsp; Organization Departments
                    </MDTypography>
                    {deptEditMode ? (
                        <>
                            <MDTypography>
                                <IconButton
                                    onClick={handleAddDeptEditToggle}
                                    sx={{padding: 0}}
                                >
                                    <SaveIcon sx={{fontSize: 'medium !important'}}/>
                                </IconButton>
                            </MDTypography>
                            <MDTypography sx={{padding: '0 !important'}}>
                                <IconButton
                                    onClick={handleAddDeptClick}
                                    sx={{padding: '0 !important'}}
                                >
                                    <AddIcon sx={{fontSize: 'medium !important'}}/>
                                </IconButton>
                            </MDTypography>
                        </>
                    ) : (
                        <IconButton
                            onClick={handleDeptEditClick}
                            sx={{padding: 0}}
                        >
                            <EditIcon sx={{fontSize: 'medium !important'}}/>
                        </IconButton>
                    )}
                </MDBox>

                <DataTable
                    table={{
                        columns: [
                            {Header: "Name", accessor: "name", align: "left"},
                            {Header: "Admin", accessor: "admin", align: "left"},
                            {Header: "", accessor: "actions", align: "center"}
                        ],
                        rows: departments.map((department) => {
                            return {
                                name: (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        {department.departmentName}
                                    </MDTypography>
                                ),
                                admin: (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        <EmailList admins={department.admins}/>
                                    </MDTypography>
                                ),
                                actions: deptEditMode ? (
                                    <div>
                                        <IconButton
                                            onClick={() => handleEditSingleDeptClick(department)}
                                            sx={{padding: 0, marginRight: 1}}
                                        >
                                            <EditIcon sx={{fontSize: 'medium !important'}}/>
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleRemoveDept(department._id)}
                                            sx={{padding: 0}}
                                        >
                                            <RemoveCircleOutlineIcon sx={{fontSize: 'medium !important'}}/>
                                        </IconButton>
                                    </div>
                                ) : null,
                            };
                        }),
                    }}
                    showTotalEntries={false}
                    isSorted={false}
                    noEndBorder
                    entriesPerPage={false}
                />
            </MDBox>

            <Dialog sx={{'& .MuiDialog-paper': {minWidth: '700px'}}} open={isAddDeptDialogOpen}
                    onClose={() => setIsAddDeptDialogOpen(false)}>
                <DialogTitle sx={{lineHeight: "2", textAlign: "center"}}>Add New Department</DialogTitle>
                <DialogContent>
                    <MDBox display="flex" flexDirection="column" alignItems="center" p={3}>
                        <TextField
                            label={<MDTypography fontWeight="bold" sx={{color: 'grey', fontSize: '1rem'}}>Department
                                Name</MDTypography>}
                            variant="outlined"
                            value={addDeptNewDeptName}
                            onChange={handleAddDeptNameChange}
                            fullWidth
                            sx={{mb: 2}}
                        />
                        <MDTypography variant="subtitle2" sx={{textAlign: "center"}}>
                            Please select an employee to assign as an administrator:
                        </MDTypography>
                    </MDBox>
                    <MDBox display="flex" flexDirection="column" alignItems="center">
                        <MDBox width="50%" bgcolor="background.paper" maxHeight={300} overflow="auto"
                               sx={{margin: 'auto'}}>
                            <List sx={{width: '100%', mb: 2}}>
                                {Array.isArray(adminEmployees) && Array.isArray(nonAdminEmployees) ? [...adminEmployees, ...nonAdminEmployees].map((employee) => (
                                    <ListItem
                                        button
                                        key={employee.id}
                                        onClick={() => handleAddDeptSelectEmail(employee.email)}
                                        sx={{
                                            width: '100%',
                                            backgroundColor: employee.email === addDeptSelectionWarning ? '#e0e0e0' : 'transparent',
                                            justifyContent: 'center',
                                            mx: 'auto'
                                        }}
                                    >
                                        <ListItemText primary={employee.email} sx={{
                                            textAlign: 'center',
                                            '& .MuiListItemText-primary': {fontSize: '1rem', padding: '2px'}
                                        }}/>
                                    </ListItem>
                                )) : 'Something unexpected happened while fetching organization employees.'}
                            </List>
                        </MDBox>
                        {addDeptSelectedEmail && (
                            <MDTypography variant="body2" style={{margin: '20px 0'}}>
                                {addDeptSelectedEmail} will be added as the department administrator
                            </MDTypography>
                        )}
                        {addDeptSelectionWarning && (
                            <MDTypography variant="body2" sx={{color: 'red', textAlign: 'center', mt: 2}}>
                                {addDeptSelectionWarning}
                            </MDTypography>
                        )}
                        <MDButton onClick={handleAddDeptConfirm} color="info" variant="contained"
                                  sx={{color: 'white', mt: 2, mb: 2}}>
                            Add Department
                        </MDButton>
                    </MDBox>
                </DialogContent>
            </Dialog>

            <Dialog sx={{'& .MuiDialog-paper': {minWidth: '700px'}}} open={isEditDeptDialogOpen}
                    onClose={() => setIsEditDeptDialogOpen(false)}>
                <DialogTitle sx={{lineHeight: "2", textAlign: "center"}}>Edit
                    Department: {editDept ? editDept.departmentName : ''}</DialogTitle>
                <DialogContent>
                    <MDBox display="flex" flexDirection="column" alignItems="center" p={3}>
                        <MDTypography variant="subtitle2" sx={{textAlign: "center"}}>
                            Please select an employee to add as an administrator:
                        </MDTypography>
                    </MDBox>
                    <MDBox display="flex" flexDirection="column" alignItems="center">
                        <MDBox width="50%" bgcolor="background.paper" maxHeight={300} overflow="auto"
                               sx={{margin: 'auto'}}>
                            <List sx={{width: '100%', mb: 2}}>
                                {Array.isArray(adminEmployees) && Array.isArray(nonAdminEmployees) ? [...adminEmployees, ...nonAdminEmployees].map((employee) => (
                                    <ListItem
                                        button
                                        key={employee.id}
                                        onClick={() => handleEditDeptSelectEmail(employee.email)}
                                        sx={{
                                            width: '100%',
                                            backgroundColor: employee.email === editDeptSelectionWarning ? '#e0e0e0' : 'transparent',
                                            justifyContent: 'center',
                                            mx: 'auto'
                                        }}
                                    >
                                        <ListItemText primary={employee.email} sx={{
                                            textAlign: 'center',
                                            '& .MuiListItemText-primary': {fontSize: '1rem', padding: '2px'}
                                        }}/>
                                    </ListItem>
                                )) : 'Something unexpected happened while fetching organization employees.'}
                            </List>
                        </MDBox>
                        {editDeptSelectedEmail && (
                            <MDTypography variant="body2" style={{margin: '20px 0'}}>
                                {editDeptSelectedEmail} will be added as the department administrator
                            </MDTypography>
                        )}
                        {editDeptSelectionWarning && (
                            <MDTypography variant="body2" sx={{color: 'red', textAlign: 'center', mt: 2}}>
                                {editDeptSelectionWarning}
                            </MDTypography>
                        )}
                        <MDButton onClick={handleEditDeptConfirm} color="info" variant="contained"
                                  sx={{color: 'white', mt: 2, mb: 2}}>
                            Add Administrator
                        </MDButton>
                        <MDButton onClick={handleEditDeptRemoveConfirm} color="error" variant="contained"
                                  sx={{color: 'white', mt: 2, mb: 2}}>
                            Remove Administrator
                        </MDButton>
                    </MDBox>
                </DialogContent>
            </Dialog>

            <Dialog sx={{'& .MuiDialog-paper': {minWidth: '700px'}}} open={isAddProjectDialogOpen}
                    onClose={() => setIsAddProjectDialogOpen(false)}>
                <DialogTitle sx={{lineHeight: "2", textAlign: "center"}}>Add New Project</DialogTitle>
                <DialogContent>
                    <MDBox display="flex" flexDirection="column" alignItems="center" p={3}>
                        <TextField
                            label={<MDTypography fontWeight="bold" sx={{color: 'grey', fontSize: '1rem'}}>Project
                                Name</MDTypography>}
                            variant="outlined"
                            value={addProjectNewProjectName}
                            onChange={handleAddProjectNameChange}
                            fullWidth
                            sx={{mb: 2}}
                        />
                        <MDTypography variant="subtitle2" sx={{textAlign: "center"}}>
                            Please select an employee to assign as an administrator:
                        </MDTypography>
                    </MDBox>
                    <MDBox display="flex" flexDirection="column" alignItems="center">
                        <MDBox width="50%" bgcolor="background.paper" maxHeight={300} overflow="auto"
                               sx={{margin: 'auto'}}>
                            <List sx={{width: '100%', mb: 2}}>
                                {Array.isArray(adminEmployees) && Array.isArray(nonAdminEmployees) ? (
                                    [...adminEmployees, ...nonAdminEmployees].map((employee) => (
                                        <ListItem
                                            button
                                            key={employee.id}
                                            onClick={() => handleAddProjectSelectEmail(employee.email)}
                                            sx={{
                                                width: '100%',
                                                backgroundColor: employee.email === addProjectSelectedEmail ? 'rgba(107,154,243,0.7)' : 'transparent',
                                                justifyContent: 'center',
                                                mx: 'auto'
                                            }}
                                        >
                                            <ListItemText primary={employee.email} sx={{
                                                textAlign: 'center',
                                                '& .MuiListItemText-primary': {fontSize: '1rem', padding: '2px'}
                                            }}/>
                                        </ListItem>
                                    ))
                                ) : (
                                    'Something unexpected happened while fetching organization employees.'
                                )}
                            </List>

                        </MDBox>
                        <MDTypography variant="subtitle2" sx={{textAlign: "center"}}>
                            Please select a department to assign to new project:
                        </MDTypography>
                        <MDBox width="50%" bgcolor="background.paper" maxHeight={300} overflow="auto"
                               sx={{margin: 'auto'}}>
                            <List sx={{width: '100%', mb: 2}}>
                                {Array.isArray(departments) ? [...departments].map((department) => (
                                    <ListItem
                                        button
                                        key={department.departmentName}
                                        onClick={() => handleAddProjectSelectDept(department)}
                                        sx={{
                                            width: '100%',
                                            backgroundColor: department === addProjectSelectedDept ? 'rgba(107,154,243,0.7)' : 'transparent',
                                            justifyContent: 'center',
                                            mx: 'auto'
                                        }}
                                    >
                                        <ListItemText primary={department.departmentName} sx={{
                                            textAlign: 'center',
                                            '& .MuiListItemText-primary': {fontSize: '1rem', padding: '2px'}
                                        }}/>
                                    </ListItem>
                                )) : 'Something unexpected happened while fetching organization departments.'}
                            </List>
                        </MDBox>
                        <MDTypography variant="subtitle2" sx={{textAlign: "center"}}>
                            Please select employees to assign to new project:
                        </MDTypography>
                        <MDBox width="50%" bgcolor="background.paper" maxHeight={300} overflow="auto"
                               sx={{margin: 'auto'}}>
                            <List sx={{width: '100%', mb: 2}}>
                                {Array.isArray(adminEmployees) && Array.isArray(nonAdminEmployees) ? (
                                    [...adminEmployees, ...nonAdminEmployees].map((employee) => (
                                        <ListItem
                                            key={employee.id}
                                            sx={{
                                                width: '100%',
                                                justifyContent: 'center',
                                                mx: 'auto'
                                            }}
                                            button
                                            onClick={() => handleAddProjectTeamToggle(employee.email)}
                                        >
                                            <Checkbox
                                                checked={addProjectSelectedTeam.indexOf(employee.email) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                            <ListItemText
                                                primary={employee.email}
                                                sx={{
                                                    textAlign: 'center',
                                                    '& .MuiListItemText-primary': {fontSize: '1rem', padding: '2px'}
                                                }}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    'Something unexpected happened while fetching organization employees.'
                                )}
                            </List>
                        </MDBox>
                        {addProjectSelectedEmail && (
                            <MDTypography variant="body2" style={{margin: '20px 0'}}>
                                {addProjectSelectedEmail} will be added as the project administrator
                            </MDTypography>
                        )}
                        {addProjectSelectionWarning && (
                            <MDTypography variant="body2" sx={{color: 'red', textAlign: 'center', mt: 2}}>
                                {addProjectSelectionWarning}
                            </MDTypography>
                        )}
                        <MDButton onClick={handleAddProjectConfirm} color="info" variant="contained"
                                  sx={{color: 'white', mt: 2, mb: 2}}>
                            Add Project
                        </MDButton>
                    </MDBox>
                </DialogContent>
            </Dialog>

            <MDBox display="flex" flexDirection="column">
                <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                    <MDTypography
                        variant="button"
                        fontWeight="medium"
                        color="text"
                    >
                        &nbsp; Organization Projects
                    </MDTypography>
                    {projectEditMode ? (
                        <>
                            <MDTypography>
                                <IconButton
                                    onClick={handleAddProjectEditToggle}
                                    sx={{padding: 0}}
                                >
                                    <SaveIcon sx={{fontSize: 'medium !important'}}/>
                                </IconButton>
                            </MDTypography>
                            <MDTypography sx={{padding: '0 !important'}}>
                                <IconButton
                                    onClick={handleAddProjectClick}
                                    sx={{padding: '0 !important'}}
                                >
                                    <AddIcon sx={{fontSize: 'medium !important'}}/>
                                </IconButton>
                            </MDTypography>
                        </>
                    ) : (
                        <IconButton
                            onClick={handleProjectEditClick}
                            sx={{padding: 0}}
                        >
                            <EditIcon sx={{fontSize: 'medium !important'}}/>
                        </IconButton>
                    )}
                </MDBox>
                <DataTable
                    table={{
                        columns: [
                            {Header: "Project", accessor: "projectName", align: "left"},
                            {Header: "Department", accessor: "departmentName", align: "left"},
                            {Header: "Admins", accessor: "projectAdmins", align: "left"},
                            {Header: "Team", accessor: "projectTeam", align: "left"},
                            {Header: "", accessor: "actions", align: "left"}
                        ],
                        rows: departments.flatMap(department =>
                            department.projects.map(project => ({
                                projectName: (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        {project.projectName}
                                    </MDTypography>
                                ),
                                departmentName: (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        {department.departmentName}
                                    </MDTypography>
                                ),
                                projectAdmins: (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        <EmailList admins={project.projectAdministrators}/>
                                    </MDTypography>
                                ),
                                projectTeam: (
                                    <MDTypography variant="caption" color="text" fontWeight="regular">
                                        <EmailList admins={project.employees}/>
                                    </MDTypography>
                                ),
                                actions: projectEditMode ? (
                                    <div>
                                        <IconButton
                                            onClick={() => handleEditSingleProjectClick(project)}
                                            sx={{padding: 0, marginRight: 1}}
                                        >
                                            <EditIcon sx={{fontSize: 'medium !important'}}/>
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleRemoveProject(project._id, department._id)}
                                            sx={{padding: 0}}
                                        >
                                            <RemoveCircleOutlineIcon sx={{fontSize: 'medium !important'}}/>
                                        </IconButton>
                                    </div>
                                ) : null
                            }))
                        ),
                    }}
                    showTotalEntries={false}
                    isSorted={false}
                    noEndBorder
                    entriesPerPage={false}
                />
            </MDBox>
        </Card>
    )
        ;

}

export default Organizations;
