import React, { useContext, useRef, useState } from "react";
import "./Box.css";
import Draggable from "react-draggable";
import Popup from "reactjs-popup";
import { CanvasContext, constants } from "./../SwitchView";
import ConnectPointsWrapper from "./ConnectPointsWrapper";

const Box = (props) => {
  const c = useContext(CanvasContext);
  const { boxes, box } = props;
  const [wasDragged, setWasDragged] = useState(false);

  if (!box.shape) box.shape = "wideBox";
  const handleDrag = (e, data, id) => {
    let newBoxes = [...boxes];
    let i = boxes.findIndex((b) => b.id === id);
    newBoxes[i].x = data.lastX;
    newBoxes[i].y = data.lastY;
    c.setBoxes(newBoxes);
  };

  let background = c.chooseBoxBackground(box);

  box.ref = useRef();

  return (
    <Draggable
      bounds="#boxesContainer"
      onStart={(e) => e.stopPropagation()}
      onDrag={(e, data) => {
        handleDrag(e, data, box.id);
      }}
      onStop={(e, data) => handleDrag(e, data, box.id)}
      position={{ x: box.x, y: box.y }}
      grid={constants.draggingGrid}
    >
      <div
        ref={box.ref}
        className={`${box.shape} absolute hoverMarker`}
        style={{ background }}
        onClick={(e) => {
          if (wasDragged == false) c.handleBoxClick(e, box);
          setWasDragged(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        id={box.id}
      >
        <div>{box.name ? box.name : box.id}</div>
        <ConnectPointsWrapper element={box} setWasDragged={setWasDragged} />
      </div>
    </Draggable>
  );
};

export default React.memo(Box);
