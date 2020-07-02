import React, { useContext } from "react";
import Port, { PortType } from "./Port";
import { lineType } from "../SwitchView";
import XarrowWrapper from "./XarrowWrapper";
import { CanvasContext } from "../SwitchView";

export type portPolarityType = "input" | "output";

const PortBar = ({
  ports,
  portPolarity,
  lines = [],
}: {
  ports: PortType[];
  portPolarity: portPolarityType;
  lines?: lineType[];
}) => {
  //   console.log("PortsBar renderd");
  const c = useContext(CanvasContext);

  return (
    <div className="portsBarStyle" id="portsInputsBar">
      <u className="portTitleStyle">{portPolarity}s</u>
      {ports.map((port) => {
        const id = port.id + `:<${portPolarity}>`;
        return <Port key={id} port={{ ...port, id }} portPolarity={portPolarity} lines={lines} />;
      })}

      {/* adding port will maybe be supported later */}
      {/* <div className="button" style={{ position: "absolute", bottom: 5 }} onClick={handleAddPort}>
        <MaterialIcon size={30} icon="add" className="material-icons" />
      </div> */}
    </div>
  );
};

export default React.memo(PortBar);
