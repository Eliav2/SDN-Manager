import React, { useEffect, useState } from "react";
import "./App.css";
import SwitchView from "./pages/SwitchView/SwitchView";
import SwitchesPage from "./pages/switches/SwitchesPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";

export const proxyAddress = "http://localhost:9089/";
// in production proxyAddress should be '' !

export type portType = {
  advertised: number;
  config: number;
  curr: number;
  curr_speed: number;
  hw_addr: string;
  max_speed: number;
  name: string;
  peer: number;
  port_no: string;
  state: number;
  supported: number;
};

export type switchesType = {
  [dpid: string]: {
    ports: portType[];
    name: string;
  };
};

const App = () => {
  const [dataFetched, setDataFetched] = useState(false);
  const [switches, setSwitches] = useState<switchesType>({});
  const [connectFailed, setConnectFailed] = useState(false);

  useEffect(() => {
    let switches: { [dpid: string]: portType[] } = {};
    fetch(proxyAddress + "http://localhost:8080/stats/switches")
      .then((res) => res.json())
      .then(
        (switchesDpids: string[]) => {
          const promises = switchesDpids.map((dpid) => {
            return fetch(proxyAddress + "http://localhost:8080/stats/portdesc/" + dpid)
              .then((res) => res.json())
              .then(
                (ports) => {
                  switches = Object.assign(switches, ports);
                },
                (error) => {
                  throw error;
                }
              );
          });
          Promise.all(promises).then(() => {
            let parsed_switches: switchesType = {};
            for (let dpid in switches) {
              for (let i = 0; i < switches[dpid].length; i++) {
                if (switches[dpid][i].port_no === "LOCAL") {
                  parsed_switches[dpid] = Object.assign({ ports: switches[dpid] }, { name: switches[dpid][i].name });
                }
              }
            }
            setSwitches(parsed_switches);
            setDataFetched(true);
          });
        },
        (error) => {
          setConnectFailed(true);
          throw error;
        }
      );
  }, []);

  return (
    <div>
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
          </Switch>
        </Router>
      ) : (
        <div className="mainWindow">
          {connectFailed ? (
            <h3>
              Can't connect to controller, or to ofctl_rest API at port 8080.
              <br />
              (or in development - check proxy server is running)
            </h3>
          ) : (
            <div>
              <h3>fetching switches...</h3>
              <BounceLoader size={150} color={"#123abc"} loading={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
