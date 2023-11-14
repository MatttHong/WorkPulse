import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    // Define the fetchEmployees function
    const fetchEmployees = async () => {
        try {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQ0Njc5MTgxMTFhODlmNmNkZDk1NDYiLCJpYXQiOjE2OTk5NjkyMDYsImV4cCI6MTY5OTk5ODAwNn0.ctR9unwTDNEegGJom2bflYdazfzuwnCvHHKePPdwlZ4";
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
        fetchEmployees().then(data => setEmployees(data));
    }, []);

    return (
        <div>
            <h1>Employees</h1>
            <ul>
                {employees.map(employee => (
                    <li key={employee._id}>{employee.name} - {employee.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
