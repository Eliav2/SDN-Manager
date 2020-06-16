import React, { useState, useRef, useContext } from "react";
import Draggable from "react-draggable";
import Xarrow from "react-xarrows";
import { CanvasContext } from "./../SwitchView";

const d = {
  left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
  right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
  bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
};
const connectPointStyle = {
  position: "absolute",
  width: 15,
  height: 15,
  borderRadius: "50%",
  background: "black",
};

const ConnectPointsWrapper = ({ connectPoints = ["right", "left", "top", "bottom"], element, setWasDragged }) => {
  const c = useContext(CanvasContext);

  const refs1 = { right: useRef(), left: useRef(), top: useRef(), bottom: useRef() };
  const refs2 = { right: useRef(), left: useRef(), top: useRef(), bottom: useRef() };

  const [dumyRender, setDumyRender] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);

  const emptyImg = new Image();

  return (
    <div
      style={{ border: "yellow 1px dashed", width: "100%", height: "100%", position: "absolute" }}
      onMouseEnter={() => console.log("?")}
      // draggable
      onDragStart={(e) => {
        // e.dataTransfer.setData();
      }}
    >
      {connectPoints.map((direction) => (
        <React.Fragment key={direction}>
          <div
            ref={refs1[direction]}
            className="connectPoint"
            key={direction}
            style={{ ...connectPointStyle, ...d[direction] }}
            // onDragStart={(e) => {
            //   console.log("onDragEnd");
            //   e.dataTransfer.setDragImage(emptyImg, 0, 0);
            // }}
            // onDragOver={(e) => {
            //   console.log("onDragOver");
            //   e.preventDefault();
            // }}
            // onClick={(e) => {
            //   console.log("onClick");
            //   e.preventDefault();
            // }}
            // onMouseOver={() => console.log("onMouseOver")}
            // onMouseEnter={() => console.log("onMouseOver")}
            // onDrop={() => console.log("ondrop")}
            // draggable
          />
          <div className="connectPoint" style={{ ...connectPointStyle, ...d[direction] }}>
            <Draggable
              onStart={(e) => {
                // e.stopPropagation();
                setBeingDragged(direction);
                c.handleBoxClick(e, element);
                c.setActionState("Add Connections");
              }}
              position={{ x: 0, y: 0 }}
              onStop={(e) => {
                setBeingDragged(null);
              }}
              onDrag={() => {
                setDumyRender({});
                setWasDragged(direction);
              }}
            >
              <div
                ref={refs2[direction]}
                key={direction}
                style={{ ...connectPointStyle }}
                // onMouseEnter={() => console.log("onMouseEnter")}
                // onDragStart={() => console.log("onDragOver")}
              />
            </Draggable>
          </div>
          {beingDragged === direction ? (
            <Xarrow start={refs1[direction]} end={refs2[direction]} passProps={{ pointerEvents: "none", opacity: 1 }} />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ConnectPointsWrapper;
