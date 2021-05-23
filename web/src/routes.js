import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./screens/Home";
import Quiz from "./screens/Quiz";
import Result from "./screens/Result";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/quiz/:numberOfQuestions" component={Quiz} />
        <Route path="/result/:indexOfHistoricQuizList" component={Result} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
