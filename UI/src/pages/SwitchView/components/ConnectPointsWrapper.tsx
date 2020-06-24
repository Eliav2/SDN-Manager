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

//:{box:BoxType;handler:keyof typeof connectPointOffset,}
const ConnectPointsWrapper = ({
  element,
  handlers = ["left", "right", "bottom", "top"],
}: {
  element: BoxType | PortType;
  handlers?: (keyof typeof connectPointOffset)[];
}) => {
  const c = useContext(CanvasContext);
  const ref1 = useRef();

  const [position, setPosition] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);
  let [x, y] = [0, 0];
  if (element.ref.current) ({ x, y } = element.ref.current.getBoundingClientRect());

  return (
    <React.Fragment>
      {handlers.map((handler) => (
        <React.Fragment key={handler}>
          <div
            className="connectPoint"
            style={
              {
                ...connectPointStyle,
                ...connectPointOffset[handler],
                ...position,
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
                left: e.clientX - x,
                top: e.clientY - y,
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
              endAnchor={{ position: "auto", offset: { rightness: 0, bottomness: 0 } }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default ConnectPointsWrapper;
// export default DragDropContext(HTML5Backend)(DragSource("connectPoint", dndSource, dndCollect)(ConnectPointsWrapper));
