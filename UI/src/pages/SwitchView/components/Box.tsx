import React, { useContext, useRef, useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { CanvasContext, constants } from "../SwitchView";
import ConnectPointsWrapper from "./ConnectPointsWrapper";

import { boxShapesType } from "../SwitchView";
import { fieldsNameType } from "./aclsFields";

export type BoxType = {
  id: string;
  shape?: boxShapesType;
  ref?: React.MutableRefObject<any>;
  x?: number;
  y?: number;
  clientX?: number;
  clientY?: number;
  name?: string;
  menuWindowOpened?: boolean;
  modData?: {
    match?: { [key in fieldsNameType<"match">]?: string };
    actions: { [key in fieldsNameType<"actions">]?: string };
  };
  visible?: boolean;
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
  // const tmp = box.ref.current.get
  if (box.ref.current) {
    let { x, y } = box.ref.current.getBoundingClientRect();
    box.clientX = x;
    box.clientY = y;
  }
  // console.log("box render");
  if (!box.name) box.name = box.id;

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
    >
      <div
        ref={box.ref}
        className={`${box.shape} absolute hoverMarker`}
        style={{ background }}
        onClick={(e) => {
          if (wasDragged === false) c.handleBoxClick(e, box);
          setWasDragged(false);
        }}
        id={box.id}
        onDragOver={(e) => {
          // console.log("box onDragOver!");

          e.stopPropagation();
          e.preventDefault();
        }}
        onDrop={(e) => {
          console.log("box on drop!");
          if (e.dataTransfer.getData("arrow") !== box.id) {
            c.addLine({ startBoxId: e.dataTransfer.getData("arrow"), endBoxId: box.id });
          }
        }}
        // onDragEnter={(e) => {
        //   console.log("box onDragEnter!");
        //   if (e.dataTransfer.getData("arrow") !== box.id) {
        //     c.addLine({ startBoxId: e.dataTransfer.getData("arrow"), endBoxId: box.id });
        //   }
        // }}
      >
        <div>{box.name}</div>
        {/* <ConnectPointsWrapper element={box} setWasDragged={setWasDragged} /> */}
        <ConnectPointsWrapper element={box} elemPos={{ x: box.clientX, y: box.clientY }} />
      </div>
    </Draggable>
  );
};

export default React.memo(Box);
