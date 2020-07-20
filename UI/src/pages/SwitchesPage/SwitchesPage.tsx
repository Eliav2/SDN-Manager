import React, { useEffect, useState } from "react";
import "./SwitchesPage.css";
import { Link } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import {
  serverSwitchesType,
  getAllSwitchesWithPortDescription,
} from "../../utils/serverRequests";
import MainWindow from "../../components/MainWindow";

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
    <MainWindow>
      {/* {dataFetched ? ( */}
      <div className="switchListTitle">
        {Object.keys(switches).length > 0
          ? "Detected vSwitches:"
          : "No Detected vSwitches."}
      </div>
      {Object.keys(switches).map((dpid) => {
        let { ports, name } = switches[dpid];
        return (
          <Link to={"/switch/" + dpid} key={dpid} className="switchList">
            {`${name} (dpid=${dpid} ports=${ports
              .map((p) => p.name)
              .toString()})`}
          </Link>
        );
      })}
    </MainWindow>
  );
};

export default SwitchesPage;
