import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginRegisterScreen from "../../screens/LoginRegisterScreen/LoginRegisterScreen";
import ConfirmEmailScreen from "../../screens/ConfirmEmailScreen/ConfirmEmailScreen";
import PrivateScreen from "../../screens/PrivateScreen/PrivateScreen";
import ForgotPasswordScreen from "../../screens/ForgotPasswordScreen/ForgotPasswordScreen";
import PasswordResetScreen from "../../screens/PasswordResetScreen/PasswordResetScreen";
// import AdminScreen from "../../screens/AdminScreen/AdminScreen";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login-register" component={LoginRegisterScreen} />
        <Route
          path="/auth/account-activation/:activationToken"
          component={ConfirmEmailScreen}
        />
        <Route exact path="/" component={PrivateScreen} />
        <Route exact path="/forgot-password" component={ForgotPasswordScreen} />
        <Route
          exact
          path="/password-reset/:resetToken"
          component={PasswordResetScreen}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
