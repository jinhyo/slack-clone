import Login from "@pages/Login/Login";
import SignUp from "@pages/Login/SignUp/SignUp";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
}

export default App;
