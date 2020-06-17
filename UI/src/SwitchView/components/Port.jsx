import React, { useState, useContext, useRef } from "react";
// import "./Box.css";
import Draggable from "react-draggable";
import Popup from "reactjs-popup";
import ConnectPointsWrapper from "./ConnectPointsWrapper";

import { CanvasContext } from "./../SwitchView";

const Port = ({ port, portType }) => {
  const c = useContext(CanvasContext);
  const [wasDragged, setWasDragged] = useState(false);
  let background = c.chooseBoxBackground(port);
  port.ref = useRef();

  return (
    <div>
      <Popup
        trigger={
          <div
            onDragStart={(e) => console.log("onDragStart", e.target)}
            ref={port.ref}
            className={`portBox hoverMarker`}
            style={{ background, position: "relative" }}
            onClick={(e) => {
              if (wasDragged == false) c.handleBoxClick(e, port);
              setWasDragged(false);
            }}
            id={port.id}
            // draggable
          >
            {/* <ConnectPointsWrapper
              // onDrop
              connectPoints={[portType === "input" ? "right" : "left"]}
              element={port}
              setWasDragged={setWasDragged}
            /> */}
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
          {Object.keys(port.port).map((detail, i) => {
            // console.log(detail, port.port[detail]);
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
