import React, { useState, useRef, useContext } from "react";
import Xarrow from "react-xarrows";
import { CanvasContext } from "../SwitchView";
import { PortType } from "./Port";
import { BoxType } from "./Box";

const connectPointStyle = {
  position: "absolute",
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "black",
};
const connectPointOffset = {
  left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
  right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
  bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
} as const;

const ConnectPointsWrapper = ({
  element,
  handlers = ["left", "right", "bottom", "top"],
  elemPos = { x: 0, y: 0 },
}: {
  element: BoxType | PortType;
  handlers?: (keyof typeof connectPointOffset)[];
  elemPos?: { x: number; y: number };
}) => {
  return (
    <React.Fragment>
      {handlers.map((handler) => (
        <ConnectPoint {...{ handler, element, elemPos, key: handler }} />
      ))}
    </React.Fragment>
  );
};

const ConnectPoint = ({
  element,
  handler,
  elemPos = { x: 0, y: 0 },
}: {
  element: BoxType | PortType;
  handler?: keyof typeof connectPointOffset;
  elemPos?: { x: number; y: number };
}) => {
  const c = useContext(CanvasContext);
  const ref1 = useRef();

  const [position, setPosition] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);

  return (
    <React.Fragment key={handler}>
      <div
        className="connectPoint"
        style={
          {
            ...connectPointStyle,
            ...connectPointOffset[handler],
            ...position,
            zIndex: 1,
          } as React.CSSProperties
        }
        draggable
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={(e) => {
          setBeingDragged(true);
          c.setSelected(element);
          c.handleBoxClick(e, element);
          c.setActionState("Add Connections");
          e.dataTransfer.setData("arrow", element.id);
        }}
        onDrag={(e) => {
          setPosition({
            position: "fixed",
            left: e.clientX - elemPos.x,
            top: e.clientY - elemPos.y,
            transform: "none",
            opacity: 0,
          });
        }}
        ref={ref1}
        onDragEnd={(e) => {
          setPosition({});
          setBeingDragged(false);
          c.handleSelect(null);
        }}
      />
      {beingDragged ? (
        <Xarrow
          start={element.id}
          end={ref1}
          startAnchor={handler}
          advanced={{ passProps: { divContainer: { style: { zIndex: 1 } } } }}
        />
      ) : null}
    </React.Fragment>
  );
};

export default ConnectPointsWrapper;
// export default DragDropContext(HTML5Backend)(DragSource("connectPoint", dndSource, dndCollect)(ConnectPointsWrapper));
