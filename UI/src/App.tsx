import React, { useEffect, useState } from "react";
import "./App.css";
import SwitchView from "./pages/SwitchView/SwitchView";
import SwitchesPage from "./pages/SwitchesPage/SwitchesPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loading from "./components/Loading";
import { Container } from "@material-ui/core";
import { getAllSwitchesWithPortDescription, serverSwitchesType } from "./utils/serverRequests";
import ServerError from "./components/ServerError";
import MainWindow from "./components/MainWindow";
import LoginPage from "./pages/LoginPage";

const proxyAddress = "http://localhost:9089";
const defaultOfctlRestUrl = proxyAddress + "/" + "http://localhost:8080";

const App = () => {
  const [switches, setSwitches] = useState<serverSwitchesType>({});
  const [ofctlRestUrl, setOfctlRestUrl] = useState(defaultOfctlRestUrl);

  // const [dataFetched, setDataFetched] = useState(false);
  // const [connectFailed, setConnectFailed] = useState(false);

  // const fetchSwitches = (url: string) => {
  //   getAllSwitchesWithPortDescription({
  //     url,
  //     onSuccess: (switches) => {
  //       setSwitches(switches);
  //       setDataFetched(true);
  //     },
  //     onError: (error: any) => {
  //       setConnectFailed(true);
  //       throw error;
  //     },
  //   });
  // };

  // useEffect(() => {
  //   fetchSwitches(ofctlRestUrl);
  // }, []);

  // if (connectFailed === true) return <ServerError />;
  // if (dataFetched === false) return <Loading />;

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
            <SwitchView {...{ switches, ofctlRestUrl }} />
          </Route>
          <Route exact path="/">
            <LoginPage {...{ ofctlRestUrl, setOfctlRestUrl, setSwitches }} />
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
