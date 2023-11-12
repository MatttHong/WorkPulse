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
import ProjecsPage from "layouts/projects"
import OrgsPage from "layouts/organizations";
import Profile from "layouts/profile"

import { BrowserRoute, Switch, Route } from "react-router-dom";
// import { useUser } from "context";
// @mui icons
import Icon from "@mui/material/Icon";




const employeeRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
      type: "collapse",
      name: "Projects",
      key: "projects-page",
      icon: <Icon fontSize="small">projects</Icon>,
      route: "/projects",
      component: <ProjecsPage />,
    },
    {
      type: "collapse",
      name: "Organizations",
      key: "organizations",
      icon: <Icon fontSize="small">person</Icon>,
      route: "/organizations",
      component: <OrgsPage />,
    },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
];


export default employeeRoutes;
