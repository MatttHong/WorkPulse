
// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard"
import Profile from "layouts/profile";
import ProjecsPage from "layouts/projects"
import OrgsPage from "layouts/organizations";
// import SignIn from "layouts/authentication"
import AcceptInvitation from "layouts/dashboard/components/MembersOverview/acceptInvite"; // This is the component you will create
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

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
    {
        type: "collapse",
        name: "Signin",
        key: "signin",
        route: "/sign-in",
        component: <SignIn />,
      },
    
  
  ];

  // adminRoutes.push(acceptInvitationRoute);


export default adminRoutes;