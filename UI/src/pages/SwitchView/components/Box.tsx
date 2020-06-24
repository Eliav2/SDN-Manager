import React, { useContext, useRef, useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { CanvasContext, constants } from "../SwitchView";
import ConnectPointsWrapper from "./ConnectPointsWrapper";

import { boxShapesType } from "../SwitchView";

export type BoxType = {
  id: string;
  shape?: boxShapesType;
  ref?: React.MutableRefObject<any>;
  x?: number;
  y?: number;
  name?: string;
  menuWindowOpened?: boolean;
  modData?: { match: []; actions: [] };
};

const Box = (props: { box: BoxType; boxes: BoxType[] }) => {
  const c = useContext(CanvasContext);
  const { boxes, box } = props;
  const [wasDragged, setWasDragged] = useState(false);

  if (!box.shape) box.shape = "modBox";
  if (!box.x) box.x = 0;
  if (!box.y) box.y = 0;
  const handleDrag = (e: DraggableEvent, data: DraggableData, id: string) => {
    let newBoxes = [...boxes];
    let i = boxes.findIndex((b) => b.id === id);
    newBoxes[i].x = data.lastX;
    newBoxes[i].y = data.lastY;
    c.setBoxes(newBoxes);
  };

  let background = c.chooseBoxBackground(box);

  box.ref = useRef();
  // const boxRef = useRef();
  const dragRef = useRef();
  return (
    <Draggable
      bounds="#boxesContainer"
      onStart={(e) => e.stopPropagation()}
      onDrag={(e, data) => {
        handleDrag(e, data, box.id);
      }}
      onStop={(e, data) => handleDrag(e, data, box.id)}
      position={{ x: box.x, y: box.y }}
      grid={[constants.draggingGrid[0], constants.draggingGrid[1]]}
      ref={dragRef}
    >
      <div
        ref={box.ref}
        className={`${box.shape} absolute hoverMarker`}
        style={{ background }}
        onClick={(e) => {
          if (wasDragged == false) c.handleBoxClick(e, box);
          setWasDragged(false);
        }}
        id={box.id}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          if (e.dataTransfer.getData("arrow") != box.id) {
            c.addLine({ startBoxId: e.dataTransfer.getData("arrow"), endBoxId: box.id });
          }
        }}
      >
        <div>{box.name ? box.name : box.id}</div>
        {/* <ConnectPointsWrapper element={box} setWasDragged={setWasDragged} /> */}
        <ConnectPointsWrapper element={box} />
      </div>
    </Draggable>

    //   <Draggable
    //   ref={dragRef}
    //   onDrag={e => {
    //     // console.log(e);
    //     setArrows(arrows => [...arrows]);
    //   }}
    // >
    //   <div
    //     id={boxId}
    //     ref={boxRef}
    //     style={boxStyle}
    //     onDragOver={e => e.preventDefault()}
    //     onDrop={e => {
    //       if (e.dataTransfer.getData("arrow") === boxId) {
    //         console.log(e.dataTransfer.getData("arrow"), boxId);
    //       } else {
    //         const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
    //         addArrow(refs);
    //         console.log("droped!", refs);
    //       }
    //     }}
    //   >
    //     {text}
    //     <ConnectPointsWrapper {...{ boxId, handler, dragRef, boxRef }} />
    //   </div>
    // </Draggable>
  );
};

export default React.memo(Box);
