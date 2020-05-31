import React, { useState } from "react";
import "./Box.css";
import Draggable from "react-draggable";

// const Box = (props) => {
const Box = ({ box, boxes, actionState, setBoxes, position, sidePos, selected, lines, setLines, handleSelect }) => {
  if (!box.shape) box.shape = "wideBox";
  // console.log(`rerender ${box.id}`);
  const handleDrag = (e, data, id) => {
    let newBoxes = [...boxes];
    let i = boxes.findIndex((b) => b.id === id);
    newBoxes[i].x = data.lastX;
    newBoxes[i].y = data.lastY;
    setBoxes(newBoxes);
  };
  const handleClick = (e) => {
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    if (actionState === "Normal") {
      handleSelect(e);
    } else if (actionState === "Add Connections" && selected.id !== box.id) {
      setLines((lines) => [
        ...lines,
        {
          props: { start: selected.id, end: box.id },
        },
      ]);
    } else if (actionState === "Remove Connections") {
      setLines((lines) => lines.filter((line) => !(line.props.start === selected.id && line.props.end === box.id)));
    }
  };

  // console.log(actionState);
  let background = null;
  if (selected && selected.id === box.id) {
    background = "rgb(200, 200, 200)";
  } else if (
    (actionState === "Add Connections" &&
      // sidePos !== "right" &&
      lines.filter((line) => line.props.start === selected.id && line.props.end === box.id).length === 0) ||
    (actionState === "Remove Connections" &&
      lines.filter((line) => line.props.start === selected.id && line.props.end === box.id).length > 0)
  ) {
    background = "LemonChiffon";
  }

  if (!box.x) box.x = 0;
  if (!box.y) box.y = 0;

  return (
    <React.Fragment>
      <Draggable
        onStart={() => position !== "static"}
        bounds="parent"
        onDrag={(e, data) => handleDrag(e, data, box.id)}
        position={{ x: box.x, y: box.y }}
      >
        <div
          ref={box.ref}
          className={`${box.shape} ${position} hoverMarker`}
          style={{ background }}
          onClick={handleClick}
          id={box.id}
        >
          {box.name ? box.name : box.id}
        </div>
      </Draggable>
      {/*{type === "middleBox" && menuWindowOpened ?*/}
      {/*  <MenuWindow setBoxes={props.setBoxes} box={props.box}/> : null*/}
      {/*}*/}
    </React.Fragment>
  );
};

export default React.memo(Box);
