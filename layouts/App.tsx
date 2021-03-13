import loadable from "@loadable/component";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

const Login = loadable(() => import("@pages/Login/Login"));
const SignUp = loadable(() => import("@pages/SignUp/SignUp"));
const Channel = loadable(() => import("@pages/Channel/Channel"));

function App() {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/channel" component={Channel} />
    </Switch>
  );
}

export default App;
