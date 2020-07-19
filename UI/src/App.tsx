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

export const proxyAddress = "http://localhost:9089/";
// in production proxyAddress should be '' !

const App = () => {
  const [dataFetched, setDataFetched] = useState(false);
  const [switches, setSwitches] = useState<serverSwitchesType>({});
  const [connectFailed, setConnectFailed] = useState(false);

  useEffect(() => {
    getAllSwitchesWithPortDescription({
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

  return (
    <Container maxWidth="lg">
      <header className="mainTitle">SDN Manager</header>
      <hr />
      {dataFetched ? (
        <Router>
          <Switch>
            <Route exact path="/">
              <SwitchesPage switches={switches} />
            </Route>
            <Route path="/switch/:dpid">
              <SwitchView switches={switches} />
            </Route>
            <Route path="*">
              <div className="mainWindow">
                <h3>404 Not Found</h3>
              </div>
            </Route>
          </Switch>
        </Router>
      ) : (
        <div className="mainWindow">
          {connectFailed ? <ServerError /> : <Loading />}
        </div>
      )}
      <div style={{ marginTop: 30 }}></div>
    </Container>
  );
};

export default App;
