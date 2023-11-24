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
                <MDBox mt={4.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            {/*<MDBox mb={3}>*/}
                            {/*    <ReportsLineChart*/}
                            {/*        color="success"*/}
                            {/*        title="daily sales"*/}
                            {/*        description={*/}
                            {/*            <>*/}
                            {/*                (<strong>+15%</strong>) increase in today sales.*/}
                            {/*            </>*/}
                            {/*        }*/}
                            {/*        date="updated 4 min ago"*/}
                            {/*        chart={sales}*/}
                            {/*    />*/}
                            {/*</MDBox>*/}
                        </Grid>
                        {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid> */}
                    </Grid>
                </MDBox>

                <MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <OrganizationsOverview/>
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            {/*<MembersOverview/>*/}
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            {/*<ProjectsOverview/>*/}
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
            <Footer/>
        </DashboardLayout>
    );
}

export default Dashboard;

