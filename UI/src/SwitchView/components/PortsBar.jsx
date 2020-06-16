import React from "react";
import Port from "./Port";

const PortBar = ({ ports, portType }) => {
  //   let background = null;
  //   if (selected && selected.id === box.id) {
  //     background = "rgb(200, 200, 200)";
  //   } else if (
  //     (actionState === "Add Connections" &&
  //       // sidePos !== "right" &&
  //       lines.filter((line) => line.props.start === selected.id && line.props.end === box.id).length === 0 &&
  //       !box.id.includes(":<input>")) ||
  //     (actionState === "Remove Connections" &&
  //       lines.filter((line) => line.props.start === selected.id && line.props.end === box.id).length > 0)
  //   ) {
  //     background = "LemonChiffon";
  //   }

  //   console.log("PortsBar renderd");

  return (
    <div className="portsBarStyle" id="portsInputsBar">
      <u className="portTitleStyle">{portType}s</u>
      {ports.map((port) => {
        const id = port.id + `:<${portType}>`;
        return <Port key={id} port={{ ...port, id }} portType={portType} />;
      })}

      {/* adding port will maybe be supported later */}
      {/* <div className="button" style={{ position: "absolute", bottom: 5 }} onClick={handleAddPort}>
        <MaterialIcon size={30} icon="add" className="material-icons" />
      </div> */}
    </div>
  );
};

export default React.memo(PortBar);
