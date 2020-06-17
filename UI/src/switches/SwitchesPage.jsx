import React from "react";
import "./SwitchesPage.css";
import { Link } from "react-router-dom";

const SwitchesPage = (props) => {
  return (
    <div className="mainWindow">
      <React.Fragment>
        <div className="switchListTitle">
          {Object.keys(props.switches).length > 0 ? "Detected vSwitches:" : "No Detected vSwitches."}
        </div>
        {Object.keys(props.switches).map((dpid) => {
          let { ports, name } = props.switches[dpid];
          return (
            <Link to={"/switch/" + dpid} key={dpid} className="switchList">
              {`${name} (dpid=${dpid} ports=${ports.map((p) => p.name).toString()})`}
            </Link>
          );
        })}
      </React.Fragment>
    </div>
  );
};

export default SwitchesPage;
