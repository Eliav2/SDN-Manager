import React, { useState } from "react";
import "./App.css";
import SwitchView from "./pages/SwitchView/SwitchView";
import SwitchesPage from "./pages/SwitchesPage/SwitchesPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import MainWindow from "./components/MainWindow";
import LoginPage from "./pages/LoginPage";

const proxyAddress = "http://localhost:9089";
const defaultOfctlRestUrl = proxyAddress + "/" + "http://localhost:8080";

const App = () => {
  const [ofctlRestUrl, setOfctlRestUrl] = useState(defaultOfctlRestUrl);

  return (
    <Container maxWidth="lg">
      <header className="mainTitle">SDN Manager</header>
      <hr />
      <Router>
        <Switch>
          <Route path="/switches">
            <SwitchesPage url={ofctlRestUrl} />
          </Route>
          <Route path="/switch/:dpid">
            <SwitchView {...{ ofctlRestUrl }} />
          </Route>
          <Route exact path="/">
            <LoginPage {...{ ofctlRestUrl, setOfctlRestUrl }} />
          </Route>
          <Route path="*">
            <MainWindow>
              <h3>404 Not Found</h3>
            </MainWindow>
          </Route>
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
