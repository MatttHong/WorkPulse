import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import ProjectsOverview from 'layouts/dashboard/components/ProjectsOverview';
import TasksOverview from 'layouts/dashboard/components/TasksOverview';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { MaterialUIControllerProvider } from 'context';
import theme from 'assets/theme'; 
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';

fetchMock.enableMocks();

describe('ProjectsOverview', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });
  
    it('renders Card', async () => {
        const mockProjects = [
          ];
      fetchMock.mockResponseOnce(JSON.stringify({ logs: mockProjects }));
    
      const { getByTestId } = render(
        <ThemeProvider theme={theme}>
          <MaterialUIControllerProvider>
              <ProjectsOverview />
          </MaterialUIControllerProvider>
        </ThemeProvider>
      );
  
      await waitFor(() => {
        expect(getByTestId('card-component')).toBeInTheDocument();

      });
      
    });
    it('renders data table', async () => {
        const mockProjects = [
            { projectName: 'Project 1', projectAdministrators: ['admin1'], employees: ['emp1'], tasks: ['task1'], departments: ['dept1'], status: 'active' },
          ];
      fetchMock.mockResponseOnce(JSON.stringify({ logs: mockProjects }));
    
      const { getByTestId } = render(
        <ThemeProvider theme={theme}>
          <MaterialUIControllerProvider>
              <ProjectsOverview />
          </MaterialUIControllerProvider>
        </ThemeProvider>
      );
  
      await waitFor(() => {
        expect(getByTestId('data-table-component')).toBeInTheDocument();

      });
      
    });
    // it('renders data table with correct data', async () => {
    //     const mockProjects = [
    //         { projectName: 'Project 1', projectAdministrators: ['admin1'], employees: ['emp1'], tasks: ['task1'], departments: ['dept1'], status: 'active' },
    //       ];
    //   fetchMock.mockResponseOnce(JSON.stringify({ logs: mockProjects }));
    
    //   const { getByTestId, findByTestId, getByText, findByText } = render(
    //     <ThemeProvider theme={theme}>
    //       <MaterialUIControllerProvider>
    //           <ProjectsOverview />
    //       </MaterialUIControllerProvider>
    //     </ThemeProvider>
    //   );
    //   const dataTable = await findByTestId('data-table-component');
    //   expect(dataTable).toBeInTheDocument();
    //   await waitFor(() => {
    //     expect(getByText('Project 1')).toBeInTheDocument();
    //     expect(getByText('admin1')).toBeInTheDocument();
    //   });
      
    // });
      
    //   expect(getByText('emp1')).toBeInTheDocument();
    //   expect(getByText('task1')).toBeInTheDocument();
    //   expect(getByText('dept1')).toBeInTheDocument();
    //   expect(getByText('active')).toBeInTheDocument();
    //   // Check if the DataTable component is rendered
    //   const dataTable = await waitFor(() => getByTestId('data-table-component'));
    //   expect(dataTable).toBeInTheDocument();

    

    // Additional tests...
});

describe('TasksOverview', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });
  
    it('renders Card', async () => {
       
      fetchMock.mockResponseOnce(JSON.stringify());
    
      const { getByTestId } = render(
        <ThemeProvider theme={theme}>
          <MaterialUIControllerProvider>
              <TasksOverview />
          </MaterialUIControllerProvider>
        </ThemeProvider>
      );
  
      await waitFor(() => {
        expect(getByTestId('card-component')).toBeInTheDocument();

      });
      
    });
    it('renders data table', async () => {
        const mockTasks = [
            {
                taskName: 'Task 1',
                taskAdministrators: ['admin1', 'admin2'],
                employees: ['emp1', 'emp2'],
                status: 'active',
              },
              {
                taskName: 'Task 2',
                taskAdministrators: ['admin3', 'admin4'],
                employees: ['emp3', 'emp4'],
                status: 'inactive',
              },          ];
      fetchMock.mockResponseOnce(JSON.stringify({ logs: mockTasks }));
    
      const { getByTestId } = render(
        <ThemeProvider theme={theme}>
          <MaterialUIControllerProvider>
              <TasksOverview />
          </MaterialUIControllerProvider>
        </ThemeProvider>
      );
  
      await waitFor(() => {
        expect(getByTestId('data-table-component')).toBeInTheDocument();

      });
      
    });
    // it('renders data table with correct data', async () => {
    //     const mockProjects = [
    //         { projectName: 'Project 1', projectAdministrators: ['admin1'], employees: ['emp1'], tasks: ['task1'], departments: ['dept1'], status: 'active' },
    //       ];
    //   fetchMock.mockResponseOnce(JSON.stringify({ logs: mockProjects }));
    
    //   const { getByTestId, findByTestId, getByText, findByText } = render(
    //     <ThemeProvider theme={theme}>
    //       <MaterialUIControllerProvider>
    //           <ProjectsOverview />
    //       </MaterialUIControllerProvider>
    //     </ThemeProvider>
    //   );
    //   const dataTable = await findByTestId('data-table-component');
    //   expect(dataTable).toBeInTheDocument();
    //   await waitFor(() => {
    //     expect(getByText('Project 1')).toBeInTheDocument();
    //     expect(getByText('admin1')).toBeInTheDocument();
    //   });
      
    // });
      
    //   expect(getByText('emp1')).toBeInTheDocument();
    //   expect(getByText('task1')).toBeInTheDocument();
    //   expect(getByText('dept1')).toBeInTheDocument();
    //   expect(getByText('active')).toBeInTheDocument();
    //   // Check if the DataTable component is rendered
    //   const dataTable = await waitFor(() => getByTestId('data-table-component'));
    //   expect(dataTable).toBeInTheDocument();

    

    // Additional tests...
});
