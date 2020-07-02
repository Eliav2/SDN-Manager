import React from "react";
import { lineType } from "./../SwitchView";
import TopBar from "./TopBar";
import Box, { BoxType } from "./Box";

const BoxesContainer = ({
  handleDropBox,
  boxes,
  lines,
}: {
  handleDropBox: (e: any) => void;
  boxes: BoxType[];
  lines: lineType[];
}) => {
  return (
    <div
      id="boxesContainer"
      className="boxesContainer"
      onDragOver={(e) => {
        // let tmp = e.dataTransfer.getData("shape");
        // console.log("boxContainer onDragOver");
        e.stopPropagation();
        e.preventDefault();
      }}
      onDrop={handleDropBox}
    >
      <TopBar />

      {boxes.map((box) => (box.visible ? <Box key={box.id} {...({ box, boxes } as const)} /> : null))}
    </div>
  );
};

export default BoxesContainer;
