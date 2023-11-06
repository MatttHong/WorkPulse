/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard"
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ProjecsPage from "layouts/projects"

import { BrowserRoute, Switch, Route } from "react-router-dom";
// import { useUser } from "context";
// @mui icons
import Icon from "@mui/material/Icon";
import AcceptInvitation from "layouts/dashboard/components/MembersOverview/acceptInvite"; // This is the component you will create

const acceptInvitationRoute = {
  type: "collapse",
  name: "Accept Invitation",
  key: "accept-invitation",
  icon: <Icon fontSize="small">email</Icon>, // Choose an appropriate icon
  route: "/accept-invitation",
  component: <AcceptInvitation />,
  // allowedRoles: ["guest"], // Uncomment and set appropriate roles if needed
};

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    // allowedRoles: ["admin"],
  },
  {
      type: "collapse",
      name: "Projects",
      key: "projects-page",
      icon: <Icon fontSize="small">projects</Icon>,
      route: "/projects",
      component: <ProjecsPage />,
      // allowedRoles: ["admin"],
    },
  
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  //   // allowedRoles: ["admin"],
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];
// routes.push(acceptInvitationRoute);

export default routes;
