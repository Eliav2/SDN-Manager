import React, { useEffect, useState } from "react";
import "./App.css";
import Playground from "./Playground/Playground";
import SwitchesPage from "./switches/SwitchesPage";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";

const proxyAddrres = "http://localhost:9089/";
// in production proxyAddrres should be '' !

const App = () => {
  const [dataFetched, setDataFetched] = useState(false);
  const [switches, setSwitches] = useState({});
  const [connectFailed, setConnectFailed] = useState(false);

  useEffect(() => {
    let switches = {};
    fetch(proxyAddrres + "http://localhost:8080/stats/switches")
      .then((res) => res.json())
      .then(
        (switchesDpids) => {
          const promises = switchesDpids.map((dpid) => {
            return fetch(proxyAddrres + "http://localhost:8080/stats/portdesc/" + dpid)
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
            let parsed_switches = {};
            for (let dpid in switches) {
              for (let i = 0; i < switches[dpid].length; i++) {
                if (switches[dpid][i].port_no === "LOCAL") {
                  parsed_switches[dpid] = Object.assign({ ports: switches[dpid] }, { name: switches[dpid][i].name });
                }
              }
            }
            setSwitches(parsed_switches);
            console.log(parsed_switches);
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
          <Route exact path="/">
            <SwitchesPage switches={switches} />
          </Route>
          <Route path="/switch/:dpid">
            <Playground switches={switches} />
          </Route>
        </Router>
      ) : (
        <div className="mainWindow">
          {connectFailed ? (
            <h3>Can't connect to controller, or to ofctl_rest API at port 8080.</h3>
          ) : (
            <div>
              <h3>loading...</h3>
              <BounceLoader size={150} color={"#123abc"} loading={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
