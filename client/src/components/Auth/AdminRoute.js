import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "./Store";

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth() && isAuth().isAdmin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login-register",
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);

export default AdminRoute;
