import React from 'react';
import { render, waitFor } from '@testing-library/react';
import MembersOverview from 'layouts/dashboard/components/MembersOverview';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { MaterialUIControllerProvider } from 'context';
import theme from 'assets/theme'; 
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Uncomment if you want to mock MDBox
// jest.mock('components/MDBox', () => {
//   return {
//     __esModule: true,
//     default: ({ children }) => <div>{children}</div>,
//   };
// });

describe('MembersOverview', () => {
  beforeEach(() => {
    fetchMock.resetMocks();  
});

  it('renders without crashing', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ projects: [] }));    // Mock other fetch calls as needed

    render(
      <ThemeProvider theme={theme}>
        <MaterialUIControllerProvider>
          <Router>
            <MembersOverview />
          </Router>
        </MaterialUIControllerProvider>
      </ThemeProvider>
    );

    // Use waitFor or findBy queries to handle async operations
    await waitFor(() => {
      // Assertions or checks after component has rendered and useEffect has completed
    });
  });

});
