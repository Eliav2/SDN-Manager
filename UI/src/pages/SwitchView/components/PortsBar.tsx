import React from "react";
import Port, { PortType } from "./Port";

export type portPolarityType = "input" | "output";

const PortBar = ({ ports, portPolarity }: { ports: PortType[]; portPolarity: portPolarityType }) => {
  //   console.log("PortsBar renderd");

  return (
    <div className="portsBarStyle" id="portsInputsBar">
      <u className="portTitleStyle">{portPolarity}s</u>
      {ports.map((port) => {
        const id = port.id + `:<${portPolarity}>`;
        return <Port key={id} port={{ ...port, id }} portPolarity={portPolarity} />;
      })}

      {/* adding port will maybe be supported later */}
      {/* <div className="button" style={{ position: "absolute", bottom: 5 }} onClick={handleAddPort}>
        <MaterialIcon size={30} icon="add" className="material-icons" />
      </div> */}
    </div>
  );
};

export default React.memo(PortBar);
