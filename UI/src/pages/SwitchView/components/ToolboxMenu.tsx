import React from "react";
import { boxShapes } from "./../SwitchView";

const ToolboxMenu = () => {
  return (
    <div className="toolboxMenu">
      <div className="toolboxTitle">Drag & drop me!</div>
      <hr />
      <div className="toolboxContainer">
        {boxShapes.map((shapeName) => (
          <div
            key={shapeName}
            className={shapeName + " grabble"}
            onDragStart={(e) => e.dataTransfer.setData("shape", shapeName)}
            draggable
          >
            {shapeName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolboxMenu;
