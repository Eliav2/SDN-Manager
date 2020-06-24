import React from "react";
import "./SwitchesPage.css";
import { Link } from "react-router-dom";
import { switchesType } from "../../App";

const SwitchesPage = ({ switches }: { switches: switchesType }) => {
  return (
    <div className="mainWindow">
      <React.Fragment>
        <div className="switchListTitle">
          {Object.keys(switches).length > 0 ? "Detected vSwitches:" : "No Detected vSwitches."}
        </div>
        {Object.keys(switches).map((dpid) => {
          let { ports, name } = switches[dpid];
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
