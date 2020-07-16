import React, { useEffect, useState } from "react";
import "./SwitchesPage.css";
import { Link } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import { serverSwitchesType, getAllSwitchesWithPortDescription } from "../../utils/serverRequests";

const SwitchesPage = ({ switches }: { switches: serverSwitchesType }) => {
  // const [dataFetched, setDataFetched] = useState(false);
  // const [switches, setSwitches] = useState<serverSwitchesType>({});
  // const [connectFailed, setConnectFailed] = useState(false);

  // useEffect(() => {
  //   getAllSwitchesWithPortDescription({
  //     onSuccess: (switches) => {
  //       setSwitches(switches);
  //       setDataFetched(true);
  //     },
  //     onError: (error: any) => {
  //       setConnectFailed(true);
  //       throw error;
  //     },
  //   });
  // }, []);
  return (
    <div className="mainWindow">
      {/* {dataFetched ? ( */}
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
      {/* ) : (
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
      )} */}
    </div>
  );
};

export default SwitchesPage;
