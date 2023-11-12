
// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard"
import Profile from "layouts/profile";
import ProjecsPage from "layouts/projects"
import OrgsPage from "layouts/organizations";

import AcceptInvitation from "layouts/dashboard/components/MembersOverview/acceptInvite"; // This is the component you will create


const acceptInvitationRoute = {
    type: "collapse",
    name: "Accept Invitation",
    key: "accept-invitation",
    route: "/accept-invitation",
    component: <AcceptInvitation />,
    // allowedRoles: ["guest"], // Uncomment and set appropriate roles if needed
  };

const adminRoutes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      route: "/dashboard",
      component: <Dashboard />,
    },
    {
        type: "collapse",
        name: "Organizations",
        key: "organizations",
        route: "/organizations",
        component: <OrgsPage />,
      },
    {
        type: "collapse",
        name: "Projects",
        key: "projects-page",
        route: "/projects",
        component: <ProjecsPage />,
      },
    {
      type: "collapse",
      name: "Profile",
      key: "profile",
      route: "/profile",
      component: <Profile />,
    },
    
  
  ];

  // adminRoutes.push(acceptInvitationRoute);


export default adminRoutes;