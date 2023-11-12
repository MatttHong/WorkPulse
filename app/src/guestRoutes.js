
// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard"
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ProjecsPage from "layouts/projects"
import Icon from "@mui/material/Icon";

const guestRoutes = [

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

export default guestRoutes;