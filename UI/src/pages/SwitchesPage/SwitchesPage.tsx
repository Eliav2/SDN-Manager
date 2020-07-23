import React, { useEffect, useState } from "react";
import "./SwitchesPage.css";
import { Link } from "react-router-dom";
import { serverSwitchesType, getAllSwitchesWithPortDescription } from "../../utils/serverRequests";
import MainWindow from "../../components/MainWindow";

const SwitchesPage = ({ url }: { url: string }) => {
  const [switches, setSwitches] = useState<serverSwitchesType>({});

  const [fetchFailed, setFetchFailed] = useState<null | Error>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllSwitchesWithPortDescription({
      url,
      onSuccess: (switches) => {
        setSwitches(switches);
        setIsLoading(false);
      },
      onError: (error: Error) => {
        // console.log(error.message);
        setFetchFailed(error);
        throw error;
      },
    });
  }, []);

  return (
    <MainWindow {...{ fetchFailed, isLoading }}>
      <div className="switchListTitle">{Object.keys(switches).length > 0 ? "Detected vSwitches:" : "No Detected vSwitches."}</div>
      {Object.keys(switches).map((dpid) => {
        let { ports, name } = switches[dpid];
        return (
          <Link to={"/switch/" + dpid} key={dpid} className="switchList">
            {`${name} (dpid=${dpid} ports=${ports.map((p) => p.name).toString()})`}
          </Link>
        );
      })}
    </MainWindow>
  );
};

export default SwitchesPage;
