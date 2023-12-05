// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import OrganizationsOverview from "layouts/organizations/components/OrganizationsOverview";

function Dashboard() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox py={3}>
                <MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <div data-testid="Organization-component">
                            <OrganizationsOverview/>
                            </div>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
            <div data-testid="Footer-component">
            <Footer/>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;

