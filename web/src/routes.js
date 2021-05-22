import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./screens/Home";
import Quiz from "./screens/Quiz";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/quiz/:numberOfQuestions" component={Quiz} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
