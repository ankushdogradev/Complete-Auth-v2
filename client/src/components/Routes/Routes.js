import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginRegisterScreen from "../../screens/LoginRegisterScreen/LoginRegisterScreen";
// import ConfirmEmailScreen from "../../screens/ConfirmEmailScreen/ConfirmEmailScreen";
// import PrivateScreen from "../../screens/PrivateScreen/PrivateScreen";
// import AdminScreen from "../../screens/AdminScreen/AdminScreen";
// import ResetPasswordScreen from "../../screens/ResetPasswordScreen/ResetPasswordScreen";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login-register" component={LoginRegisterScreen} />
      </Switch>
    </Router>
  );
};

export default Routes;
