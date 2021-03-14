import loadable from "@loadable/component";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

const Login = loadable(() => import("@pages/Login/Login"));
const SignUp = loadable(() => import("@pages/SignUp/SignUp"));
const Workspace = loadable(() => import("@layouts/Workspace/Workspace"));

function App() {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace" component={Workspace} />
    </Switch>
  );
}

export default App;
