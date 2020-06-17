import React, { useState, useRef, useContext } from "react";
import Draggable from "react-draggable";
import Xarrow from "react-xarrows";
import { CanvasContext } from "./../SwitchView";
import { DragSource, DragDropContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

const dndSource = {
  beginDrag(props) {
    // Return the data describing the dragged item
    const item = { id: props.id };
    return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    // When dropped on a compatible target, do something
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    // CardActions.moveCardToList(item.id, dropResult.listId);
  },
};

function dndCollect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
  };
}
export default ConnectPointsWrapper;
// export default DragDropContext(HTML5Backend)(DragSource("connectPoint", dndSource, dndCollect)(ConnectPointsWrapper));
