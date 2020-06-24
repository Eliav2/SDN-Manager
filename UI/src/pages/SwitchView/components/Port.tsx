import React, { useState, useContext, useRef } from "react";
// import "./Box.css";
import Draggable from "react-draggable";
import Popup from "reactjs-popup";
import ConnectPointsWrapper from "./ConnectPointsWrapper";

import { CanvasContext } from "../SwitchView";
import { portType } from "../../../App";
import { portPolarityType } from "./PortsBar";

export type PortType = {
  id: string;
  name: string;
  port: portType;
  ref: React.MutableRefObject<any>;
  shape: "portBox";
};

const Port = ({ port, portPolarity }: { port: PortType; portPolarity: portPolarityType }) => {
  const c = useContext(CanvasContext);
  const [wasDragged, setWasDragged] = useState(false);
  let background = c.chooseBoxBackground(port);
  port.ref = useRef();

  return (
    <div>
      <Popup
        trigger={
          <div
            ref={port.ref}
            className={`portBox hoverMarker`}
            style={{ background, position: "relative" }}
            onClick={(e) => {
              if (wasDragged == false) c.handleBoxClick(e, port);
              setWasDragged(false);
            }}
            id={port.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("arrow") != port.id) {
                if (portPolarity === "output")
                  c.addLine({ startBoxId: e.dataTransfer.getData("arrow"), endBoxId: port.id });
              }
            }}
          >
            <ConnectPointsWrapper element={port} handlers={portPolarity == "input" ? ["right"] : []} />
            <div>
              {port.name}
              <br />
              (...{port.port.hw_addr.slice(-5)})
              <br />({port.port.port_no})
            </div>
          </div>
        }
        position="left center"
        on="hover"
        closeOnDocumentClick
        mouseLeaveDelay={100}
        mouseEnterDelay={500}
        contentStyle={{ width: "max-content" }}
        arrow={true}
      >
        <div>
          {Object.keys(port.port).map((detail: keyof portType, i) => {
            return (
              <div key={detail}>
                {detail}: {port.port[detail]}
                <br />
              </div>
            );
          })}
        </div>
      </Popup>
    </div>
  );
};

export default React.memo(Port);