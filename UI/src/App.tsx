import React, { useEffect, useState } from "react";
import "./App.css";
import SwitchView from "./pages/SwitchView/SwitchView";
import SwitchesPage from "./pages/SwitchesPage/SwitchesPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loading from "./components/Loading";
import { Container } from "@material-ui/core";
import {
  getAllSwitchesWithPortDescription,
  serverSwitchesType,
} from "./utils/serverRequests";
import ServerError from "./components/ServerError";
import MainWindow from "./components/MainWindow";
<<<<<<< HEAD
import LoginPage from "./pages/LoginPage";

const proxyAddress = "http://localhost:9089";
const defaultOfctlRestUrl = proxyAddress + "/" + "http://localhost:8080";
=======

const proxyAddress = "http://localhost:9089";
export const ofctlRestUrl = proxyAddress + "/" + "http://localhost:8080";
>>>>>>> a3cb0e2ae5df58b9e65b8d30c415a5b3a228626f

const App = () => {
  const [switches, setSwitches] = useState<serverSwitchesType>({});
<<<<<<< HEAD
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
=======
  const [connectFailed, setConnectFailed] = useState(false);

  useEffect(() => {
    getAllSwitchesWithPortDescription({
      url: ofctlRestUrl,
      onSuccess: (switches) => {
        setSwitches(switches);
        setDataFetched(true);
      },
      onError: (error: any) => {
        setConnectFailed(true);
        throw error;
      },
    });
  }, []);
>>>>>>> a3cb0e2ae5df58b9e65b8d30c415a5b3a228626f

  return (
    <Container maxWidth="lg">
      <header className="mainTitle">SDN Manager</header>
      <hr />
<<<<<<< HEAD
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
=======
      {dataFetched ? (
        <Router>
          <Switch>
            <Route exact path="/">
              <SwitchesPage switches={switches} />
            </Route>
            <Route path="/switch/:dpid">
              <SwitchView {...{ switches, ofctlRestUrl }} />
            </Route>
            <Route path="*">
              <MainWindow>
                <h3>404 Not Found</h3>
              </MainWindow>
            </Route>
          </Switch>
        </Router>
      ) : (
        <MainWindow>{connectFailed ? <ServerError /> : <Loading />}</MainWindow>
      )}
>>>>>>> a3cb0e2ae5df58b9e65b8d30c415a5b3a228626f
    </Container>
  );
};

export default App;
